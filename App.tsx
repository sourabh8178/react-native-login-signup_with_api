import React, { useEffect } from 'react';
import { View, Text, StatusBar, Alert } from 'react-native';
import Navigation from './src/Navigation';
import { AuthProvider } from './src/Auth/AuthContext';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  
  async function requestUserPermission() {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      } else {
        console.log('Permission not granted');
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
    }
  }

  useEffect(() => {
    requestUserPermission();

    return () => {
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar backgroundColor="grey" />
      <FlashMessage position="top" />
      <Navigation />
    </AuthProvider>
  );
};

export default App;
