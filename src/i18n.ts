import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import gr from './locales/gr.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        gr: { translation: gr },
    },
    lng: 'gr', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;
