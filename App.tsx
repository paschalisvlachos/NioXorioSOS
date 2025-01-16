import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import i18n from './src/i18n';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MapScreen from './src/screens/MapScreen';
import ThankYouScreen from './src/screens/ThankYouScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="WelcomeScreen"
                    screenOptions={({ navigation, route }) => ({
                        headerStyle: {
                            backgroundColor: '#0e5765', // Custom background color
                            height: 70, // Reduced height
                        },
                        headerLeft: () => {
                            if (route.name === 'MapScreen' || route.name === 'ThankYouScreen') {
                                return (
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}
                                        style={styles.backButton}
                                    >
                                        {/* Render Ionicons Back Icon */}
                                        <Ionicons name="arrow-back" size={24} color="#ffffff" />
                                    </TouchableOpacity>
                                );
                            }
                            return null; // No back button on other screens
                        },
                        headerTitle: '', // Remove page name
                        headerRight: () => (
                            <View style={styles.headerRight}>
                                {/* Wrap text in <Text> */}
                                <Text style={styles.headerTitle}>Neo Chorio SOS</Text>
                            </View>
                        ),
                    })}
                >
                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                    <Stack.Screen name="MapScreen" component={MapScreen} />
                    <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </I18nextProvider>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 10,
    },
    headerRight: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
