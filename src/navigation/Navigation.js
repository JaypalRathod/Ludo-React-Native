import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LudoBoardScreen from '../screens/LudoBoardScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import { navigationRef } from '../helpers/NavigationUtils';


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName='SplashScreen'
                screenOptions={() => ({
                    headerShown: false,
                })}
            >
                <Stack.Screen options={{ animation: 'fade' }} name="LudoBoardScreen" component={LudoBoardScreen} />
                <Stack.Screen options={{ animation: 'fade' }} name="HomeScreen" component={HomeScreen} />
                <Stack.Screen options={{ animation: 'fade' }} name="SplashScreen" component={SplashScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;