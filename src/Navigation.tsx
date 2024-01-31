import React, {useState, useContext } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import HomeScreen from "./HomeScreen"
import LoginScreen from "./LoginScreen"
import Blog from "./Blog"
import BlogView from "./BlogView"
import ProfileScreen from "./ProfileScreen"
import RegistrationScreen from "./RegistrationScreen"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext} from "./AuthContext";
import SplashScreen from "./SplashScreen"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment,faSearch, faBell } from '@fortawesome/free-solid-svg-icons';

const Stack = createNativeStackNavigator();

const Navigation = () => {

  const {userInfo, splashLoading} = useContext(AuthContext);

  const CustomHeader = ({ title, navigation }) => {
  return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16,height: 50 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <FontAwesomeIcon icon={faSearch} size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{title}</Text>
        <TouchableOpacity style={{marginRight: -50 }} onPress={() => navigation.navigate('Notification')}>
          <FontAwesomeIcon icon={faBell} size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <FontAwesomeIcon icon={faComment} size={25} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {splashLoading ? (
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}} />
        ) : userInfo.data ? (
        <>
          <Stack.Screen
            name="AsSocial"
            component={HomeScreen}
            options={({ navigation, route }) => ({
              header: () => <CustomHeader title="SA Social" navigation={navigation} />,
            })}
          />
          <Stack.Screen name="Blog" component={Blog} />
          <Stack.Screen name="BlogView" component={BlogView} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
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