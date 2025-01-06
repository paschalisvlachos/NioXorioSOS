import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
    const { t } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'gr' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    const checkLastVisit = async () => {
        const lastVisit = await AsyncStorage.getItem('lastVisit');
        const now = new Date();
        if (lastVisit) {
            const diff = now.getTime() - new Date(lastVisit).getTime();
            const days = diff / (1000 * 60 * 60 * 24);
            if (days < 30) {
                navigation.navigate('MapScreen');
            }
        }
    };

    useEffect(() => {
        checkLastVisit();
    }, []);

    const handleContinue = async () => {
        await AsyncStorage.setItem('lastVisit', new Date().toISOString());
        navigation.navigate('MapScreen');
    };

    return (
        <View style={styles.container}>
            <Button title={i18n.language === 'en' ? 'Ελληνικά' : 'English'} onPress={toggleLanguage} />
            <Text style={styles.message}>{t('welcomeMessage')}</Text>
            <Button title={t('continue')} onPress={handleContinue} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    message: { fontSize: 18, marginBottom: 20 },
});

export default WelcomeScreen;
