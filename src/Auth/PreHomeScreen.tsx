import React from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity  } from 'react-native'
import Registration from './RegistrationScreen'
import Login from './LoginScreen'

const PreHomeScreen = (props) => {
	return (
			<View style={styles.container}>
	      <Image source={require("../assest/background.jpg")} style={styles.backgroundImage} />
	      <Image source={require("../assest/app.png")} style={styles.imageUpper} />
		      <TouchableOpacity style={styles.loginButton} onPress={() => props.navigation.navigate("Login")}>
		        <Text style={styles.buttonText}>Login</Text>
		      </TouchableOpacity>
		      <TouchableOpacity style={styles.registerButton} onPress={() => props.navigation.navigate("Registration")}>
		        <Text style={styles.buttonText}>Register</Text>
		      </TouchableOpacity>
	    </View>
	)
};
const styles = StyleSheet.create({
	container: {
    flex: 1,
    alignItems: 'center',
  },
  imageUpper: {
  	marginTop: 50,
  	height: '50%',
  	width: '98%',
  	resizeMode: 'cover'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  // buttonContainer: {
  // 	marginTop: 
  //   // padding: 30,
  //   width: '100%', // Ensure buttons take the full width
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  loginButton: {
    marginTop: 50,
    width: '85%',
    height: '8%',
    borderRadius: 75,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButton: {
    marginTop: 10,
    width: '85%',
    height: '8%',
    borderRadius: 75,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

 });
export default PreHomeScreen;