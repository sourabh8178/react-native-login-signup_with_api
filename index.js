import { firebaseConfig } from './src/Auth/Config';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the killmode!', remoteMessage);
});


initializeApp(firebaseConfig); // Initialize Firebase

AppRegistry.registerComponent(appName, () => App);