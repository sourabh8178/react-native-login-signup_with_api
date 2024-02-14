import React from 'react'
import {View, Text, StatusBar} from 'react-native'
import Navigation from "./src/Navigation"
import { AuthProvider } from "./src/Auth/AuthContext"
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#06bcee"/>
        <FlashMessage position="top" />
       <Navigation/>
    </AuthProvider>
  );
};

export default App;