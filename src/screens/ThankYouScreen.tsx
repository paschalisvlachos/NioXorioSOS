import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
            <Button title={i18n.language === 'en' ? 'Ελληνικά' : 'English'} onPress={toggleLanguage} />
            <Text style={styles.message}>{t('thankYou')}</Text>
            <Button title={t('close')} onPress={() => navigation.navigate('WelcomeScreen')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    message: { fontSize: 18, marginBottom: 20 },
});

export default ThankYouScreen;
