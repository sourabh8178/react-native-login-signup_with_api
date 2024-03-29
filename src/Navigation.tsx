import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View, Text, TouchableOpacity} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faComment, faSearch, faBell, faArrowLeft, faHome, faCompass, faEnvelope, faUser, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import HomeScreen from './HomeScreen';
import LoginScreen from './Auth/LoginScreen';
import ForgotPassword from './Auth/ForgotPassword'
import Blog from './Blog/Blog';
import Followers from './Profile/Followers';
import Following from './Profile/Following';
import BlogView from './Blog/BlogView';
import ChatScreen from './ChatScreen';
import Profile from './Profile/Profile';
import RegistrationScreen from './Auth/RegistrationScreen';
import Explore from './Explore';
import Message from './Message';
import More from './More';
import VideosScreen from './VideosScreen';
import MusicScreen from './MusicScreen';
import CreateProfile from './Profile/CreateProfile'
import UserProfile from './Profile/UserProfile';
import { AuthContext } from './Auth/AuthContext';
import SplashScreen from './SplashScreen';
import ProfileSetting from './Profile/ProfileSetting';
import EditMyProfile from './Profile/EditMyProfile';
import PreHomeScreen from './Auth/PreHomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 50 }}>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <Icon name="search" size={30} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>{title}</Text>
      <TouchableOpacity style={{ marginRight: 0 }} onPress={() => navigation.navigate('Notification')}>
        <Icon name="bell" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};
const BlogHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 50 }}>
      {/* You can customize the icon and onPress event for the back button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="black" />
        {/*<Icon name="arrow-left" size={30} color="#900" />*/}
      </TouchableOpacity>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', alignItems: 'center' }}>{title}</Text>
      <TouchableOpacity style={{ marginRight: 0 }} onPress={() => navigation.navigate('Notification')}>
        <Icon name="bell" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const ProfileHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 50 }}>
      {/* You can customize the icon and onPress event for the back button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="black" />
        {/*<Icon name="arrow-left" size={30} color="#900" />*/}
      </TouchableOpacity>
      <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', alignItems: 'center' }}>{title}</Text>
      <TouchableOpacity style={{ marginRight: 0 }} onPress={() => navigation.navigate('Notification')}>
        <Icon name="bell" size={30} color="black" />
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
          header: () => <BlogHeader title="Create Post" navigation={navigation} />,
        })}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={({ navigation, route }) => ({
        header: () => <ProfileHeader title="Profile my" navigation={navigation} />,
      })}
    />
    {/*<Stack.Screen
      name="ChatScreen"
      component={ChatScreen}
      options={{
        headerShown: false,
        bottomShown: false,
      }}
    />*/}
    <Stack.Screen name="BlogView" component={BlogView} />
    <Stack.Screen name="Followers" component={Followers} />
    <Stack.Screen name="Following" component={Following} />
    <Stack.Screen name="CreateProfile" component={CreateProfile} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false, tabBarVisible: false }} />
    <Stack.Screen name="PreHomeScreen" component={PreHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
    <Stack.Screen name="EditMyProfile" component={EditMyProfile} />
  </Stack.Navigator>
);

const AuthenticatedTabs = ({navigation, route}) => (

  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStack} options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" size={30} color="black" />
        ),
        tabBarLabelStyle: { fontSize: 16 },
      }}
    />
    <Tab.Screen name="Explore" component={Explore} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="compass" size={30} color="black" />
        ),
        tabBarLabelStyle: { fontSize: 15 },
      }}
    />
    <Tab.Screen
          name="Message"
          options={{
              headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="wechat" size={30} color="black" />
            ),
            tabBarLabelStyle: { fontSize: 15 },
          }}
        >
          {() => <Message navigation={navigation} />}
    </Tab.Screen>
      <Tab.Screen name="Profile" component={Profile}options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={30} color="black" />
          ),
          tabBarLabelStyle: { fontSize: 15 },
        }}
     />
    <Tab.Screen name="More" component={More}
      options={{
      headerShown: false, 
        tabBarIcon: ({ color, size }) => (
          <Icon name="ellipsis-h" size={30} color="black" />
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
      ) : userInfo ?  (
        <AuthenticatedTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="PreHomeScreen" component={PreHomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen}  />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;