import { firebaseConfig } from './src/Auth/Config';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';

initializeApp(firebaseConfig); // Initialize Firebase

AppRegistry.registerComponent(appName, () => App);