import React from 'react'
import {View, Text, StatusBar} from 'react-native'
import Navigation from "./src/Navigation"
import { AuthProvider } from "./src/Auth/AuthContext"

const App = () => {
  return (
    <AuthProvider>
    <StatusBar backgroundColor="#06bcee"/>
     <Navigation/>
    </AuthProvider>
  );
};

export default App;