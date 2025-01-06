import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
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
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [comments, setComments] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

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

                setLocation(coords);
                setRegion({
                    ...coords,
                    latitudeDelta: 0.005, // Closer zoom
                    longitudeDelta: 0.005,
                });
            } catch (error) {
                Alert.alert(t('error'), t('failedToGetLocation'));
                console.error('Error fetching location:', error);
            }
        };

        getCurrentLocation();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // Disable cropping
            quality: 0.5, // Reduce image size
        });
        if (!result.canceled) {
            setPhoto(result.assets[0].uri); // Save the selected photo URI
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null); // Clear the selected photo
    };

    const handleSubmit = async () => {
        if (!location || !name || !phone || !comments || !photo) {
            Alert.alert(t('error'), t('allFieldsRequired'));
            return;
        }

        const userData = {
            name,
            telephone: phone,
            comments,
            mapCoordinates: JSON.stringify(location),
            photo, // Base64 or URL
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
        <View style={styles.container}>
            <Button title={i18n.language === 'en' ? 'Ελληνικά' : 'English'} onPress={toggleLanguage} />
            <MapView
                style={styles.map}
                region={region ?? undefined}
                onRegionChangeComplete={setRegion}
                onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
                {location && <Marker coordinate={location} />}
            </MapView>
            <TextInput style={styles.input} placeholder={t('name')} onChangeText={setName} value={name} />
            <TextInput style={styles.input} placeholder={t('phone')} onChangeText={setPhone} value={phone} />
            <TextInput style={styles.input} placeholder={t('comments')} onChangeText={setComments} value={comments} />
            {photo ? (
                <View style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity onPress={handleRemovePhoto} style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>{t('removePhoto')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Button title={t('uploadPhoto')} onPress={pickImage} />
            )}
            <Button title={t('submit')} onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    input: { borderWidth: 1, padding: 10, margin: 5 },
    photoContainer: { alignItems: 'center', marginVertical: 10 },
    photo: { width: 100, height: 100, borderRadius: 8, marginBottom: 5 },
    removeButton: { backgroundColor: '#ff4444', padding: 5, borderRadius: 5 },
    removeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default MapScreen;
