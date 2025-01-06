import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MapScreen from './src/screens/MapScreen';
import ThankYouScreen from './src/screens/ThankYouScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="WelcomeScreen">
                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                    <Stack.Screen name="MapScreen" component={MapScreen} />
                    <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </I18nextProvider>
    );
}
