import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '../screens/LoginScreen';
import MainNavigator from './MainNavigator';



const AuthNavigator = () => {

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='LoginScreen' component={LoginScreen}/>
            <Stack.Screen name='Main' component={MainNavigator}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator

const styles = StyleSheet.create({})