import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { saveUser } from '../apiService';

const MapScreen = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'gr' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const [location, setLocation] = useState<LatLng | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    // Village Boundaries
    const bounds = {
        north: 35.4250, // North latitude
        south: 35.4190, // South latitude
        east: 24.1450, // East longitude
        west: 24.1380, // West longitude
    };

    const isWithinBounds = (latitude: number, longitude: number) => {
        return (
            latitude >= bounds.south &&
            latitude <= bounds.north &&
            longitude >= bounds.west &&
            longitude <= bounds.east
        );
    };

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(t('error'), t('locationPermissionDenied'));
                    return;
                }

                const currentLocation = await Location.getCurrentPositionAsync({});
                const coords = {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                };

                // Validate if the location is within Neo Chorio boundaries
                if (!isWithinBounds(coords.latitude, coords.longitude)) {
                    Alert.alert(t('error'), t('outsideVillageError'));
                    return;
                }

                setLocation(coords);
                setRegion({
                    ...coords,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            } catch (error) {
                Alert.alert(t('error'), t('failedToGetLocation'));
                console.error('Error fetching location:', error);
            }
        };

        getCurrentLocation();
    }, []);

    const toggleMapVisibility = () => {
        setMapVisible((prev) => !prev);

        // If the map is being hidden, reset the location
        if (mapVisible) {
            setLocation(null);
        }
    };

    const handleLocationSelect = (coordinate: LatLng) => {
        if (!isWithinBounds(coordinate.latitude, coordinate.longitude)) {
            Alert.alert(t('error'), t('outsideVillageError'));
            return;
        }
        setLocation(coordinate);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.5,
        });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
    };

    const handleSubmit = async () => {
        const nameRegex = /^[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ\s]+$/; // Regex for Latin, Greek letters, and spaces
        const phoneRegex = /^[0-9]+$/; // Regex for numeric values only

        if (!name.trim()) {
            Alert.alert(t('error'), t('pleaseEnterName'));
            return;
        }
        if (!nameRegex.test(name)) {
            Alert.alert(t('error'), t('nameInvalid')); // Name must contain only letters
            return;
        }
        if (name.length < 5) {
            Alert.alert(t('error'), t('nameTooShort')); // Name must be at least 5 characters long
            return;
        }
        if (!phone.trim()) {
            Alert.alert(t('error'), t('pleaseEnterPhone'));
            return;
        }
        if (!phoneRegex.test(phone)) {
            Alert.alert(t('error'), t('phoneInvalid')); // Phone must be a valid number
            return;
        }
        if (!comments.trim()) {
            Alert.alert(t('error'), t('pleaseEnterComments'));
            return;
        }

        const userData = {
            name,
            telephone: phone,
            comments,
            mapCoordinates: mapVisible ? JSON.stringify(location) : "{\"latitude\":0,\"longitude\":0}",
            photo: photo || "null", // Optional field
        };

        try {
            const response = await saveUser(userData);
            console.log('User saved:', response);
            navigation.navigate('ThankYouScreen');
        } catch (error) {
            console.error('Error saving user:', error);
            Alert.alert(t('error'), t('failedToSave'));
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Language Selector */}
                <View style={styles.languageContainer}>
                    <Text style={styles.languageText}>{t('changeLanguageTo')}:</Text>
                    <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                        <Text style={styles.languageButtonText}>
                            {i18n.language === 'en' ? 'Ελληνικά' : 'English'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Map Toggle Button */}
                <TouchableOpacity style={styles.mapToggleButton} onPress={toggleMapVisibility}>
                    <Text style={styles.mapToggleButtonText}>
                        {mapVisible ? t('hideMap') : t('showMap')}
                    </Text>
                </TouchableOpacity>

                {/* Map */}
                {mapVisible && (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region ?? undefined}
                        onRegionChangeComplete={setRegion}
                        onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
                        mapType="satellite"
                    >
                        {location && <Marker coordinate={location} />}
                    </MapView>
                </View>
                )}

                {/* Form Inputs */}
                <TextInput style={styles.input} placeholder={t('name')} onChangeText={setName} value={name} />
                <TextInput
                    style={styles.input}
                    placeholder={t('phone')}
                    onChangeText={(text) => setPhone(text.replace(/\s+/g, ''))}
                    value={phone}
                />
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder={t('comments')}
                    onChangeText={setComments}
                    value={comments}
                    multiline
                    numberOfLines={5}
                />

                {/* Photo Section */}
                {photo ? (
                    <View style={styles.photoContainer}>
                        <Image source={{ uri: photo }} style={styles.photo} />
                        <TouchableOpacity onPress={handleRemovePhoto} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>{t('removePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Text style={styles.uploadButtonText}>{t('uploadPhoto')}</Text>
                    </TouchableOpacity>
                )}

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{t('submit')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f6f5',
    },
    scrollContainer: {
        padding: 10,
    },
    languageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    languageText: {
        fontSize: 14,
        marginRight: 5,
        color: '#0e5765',
    },
    languageButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    languageButtonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    mapToggleButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    mapToggleButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    mapContainer: {
        height: 260, // Adjusted map height
        marginBottom: 10, // Add spacing below the map
    },
    map: {
        flex: 1, // Allow the map to fill the container
        borderRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#0e5765', // Updated border color
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    photoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 5,
    },
    removeButton: {
        backgroundColor: '#ff4444',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    uploadButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    uploadButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    submitButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14,
        color: '#0e5765',
        textAlign: 'center',
        marginBottom: 10,
    },    
});

export default MapScreen;
