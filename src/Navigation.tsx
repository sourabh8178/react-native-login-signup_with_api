import React, {useState, useContext } from 'react'
import {View, Text} from 'react-native'
import HomeScreen from "./HomeScreen"
import LoginScreen from "./LoginScreen"
import Blog from "./Blog"
import BlogView from "./BlogView"
import RegistrationScreen from "./RegistrationScreen"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext} from "./AuthContext";
import SplashScreen from "./SplashScreen"

const Stack = createNativeStackNavigator();

const Navigation = () => {

  const {userInfo, splashLoading} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {splashLoading ? (
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
        ) : userInfo.data ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Blog" component={Blog} />
          <Stack.Screen name="BlogView" component={BlogView} />
          </>
          ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="Registration" component={RegistrationScreen} options={{headerShown: false}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;