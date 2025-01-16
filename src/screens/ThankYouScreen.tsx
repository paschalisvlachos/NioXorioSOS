import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const ThankYouScreen = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'gr' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <View style={styles.container}>
            {/* Language Selector */}
            <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{t('changeLanguageTo')}:</Text>
                <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
                    <Text style={styles.languageButtonText}>
                        {i18n.language === 'en' ? 'Ελληνικά' : 'English'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Logo */}
            <Image
                source={require('../../assets/neochoriosos_logo_transparent.png')}
                style={styles.logo}
            />

            {/* Thank You Message */}
            <Text style={styles.message}>{t('thankYou')}</Text>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('WelcomeScreen')}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f6f5', // App background color
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    languageContainer: {
        position: 'absolute', // Position the container absolutely
        top: 10,
        right: 10, // Align to the top-right corner
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
        width: 200, // Adjust width
        height: 200, // Adjust height
        marginBottom: 20, // Spacing below the logo
        resizeMode: 'contain', // Maintain aspect ratio
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#0e5765', // Message text color
    },
    closeButton: {
        backgroundColor: '#0e5765',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ThankYouScreen;
