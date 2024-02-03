import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View, Text, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment, faSearch, faBell, faArrowLeft, faHome, faCompass, faEnvelope, faUser, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import Blog from './Blog';
import BlogView from './BlogView';
import ProfileScreen from './ProfileScreen';
import RegistrationScreen from './RegistrationScreen';
import Explore from './Explore';
import Message from './Message';
import More from './More';
import UserProfile from './UserProfile';
import { AuthContext } from './AuthContext';
import SplashScreen from './SplashScreen';
import ProfileSetting from './ProfileSetting';
import EditMyProfile from './EditMyProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 50 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <FontAwesomeIcon icon={faSearch} size={25} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>{title}</Text>
      <TouchableOpacity style={{ marginRight: 0 }} onPress={() => navigation.navigate('Notification')}>
        <FontAwesomeIcon icon={faBell} size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const BlogHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 50 }}>
      {/* You can customize the icon and onPress event for the back button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={25} color="black" />
        {/*<Icon name="arrow-left" size={30} color="#900" />*/}
      </TouchableOpacity>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', alignItems: 'center' }}>{title}</Text>
      <TouchableOpacity style={{ marginRight: 0 }} onPress={() => navigation.navigate('Notification')}>
        <FontAwesomeIcon icon={faBell} size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
        name="AsSocial"
        component={HomeScreen}
        options={({ navigation, route }) => ({
          header: () => <CustomHeader title="SA Social" navigation={navigation} />,
        })}
    />
    <Stack.Screen 
      name="Blog" 
      component={Blog}
      options={({ navigation, route }) => ({
          header: () => <BlogHeader title="Create post" navigation={navigation} />,
        })}
    />
    <Stack.Screen name="BlogView" component={BlogView} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
    <Stack.Screen name="EditMyProfile" component={EditMyProfile} />
  </Stack.Navigator>
);

const AuthenticatedTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStack} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faHome} color={color} size={size + 3} />
        ),
        tabBarLabelStyle: { fontSize: 16 },
      }}
    />
    <Tab.Screen name="Explore" component={Explore} options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faCompass} color={color} size={size + 2} />
        ),
        tabBarLabelStyle: { fontSize: 15 },
      }}
    />
    <Tab.Screen name="Message" component={Message} options={{
        tabBarIcon: ({ color, size }) => (
         <FontAwesomeIcon icon={faEnvelope} color={color} size={size + 3} />
        ),
        tabBarLabelStyle: { fontSize: 15 },
      }}
    />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen}options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={size + 3} />
          ),
          tabBarLabelStyle: { fontSize: 15 },
        }}
     />
    <Tab.Screen name="More" component={More} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesomeIcon icon={faEllipsisH} color={color} size={size + 3} />
        ),
        tabBarLabelStyle: { fontSize: 15 },
      }}
    />
  </Tab.Navigator>
);

const Navigation = () => {
  const { userInfo, splashLoading } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {splashLoading ? (
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      ) : userInfo.data ? (
        <AuthenticatedTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;