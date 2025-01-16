import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'gr' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const handleContinue = async () => {
        await AsyncStorage.setItem('lastVisit', new Date().toISOString());
        navigation.navigate('MapScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{t('changeLanguageTo')}:</Text>
                <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                    <Text style={styles.languageButtonText}>
                        {i18n.language === 'en' ? 'Ελληνικά' : 'English'}
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.message}>{t('welcomeTitle')}</Text>
            <Image source={require('../../assets/neochoriosos_logo_transparent.png')} style={styles.logo} />
            <Text style={styles.message}>{t('welcomeMessage')}</Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>{t('continue')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f6f5',
    },
    languageContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
    logo: {
        width: 200, // Adjust width to fit your design
        height: 200, // Adjust height proportionally
        resizeMode: 'contain', // Ensures the logo maintains its aspect ratio
        marginBottom: 20, // Adds spacing between the logo and welcome message
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        color: '#0e5765',
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default WelcomeScreen;
