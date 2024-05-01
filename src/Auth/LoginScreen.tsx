import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from './AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { showMessage, hideMessage } from "react-native-flash-message";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, login } = useContext(AuthContext);

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <ScrollView>
      <Image source={require('../assest/login.jpg')} style={styles.backgroundImage} />
      <View style={styles.logoText}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Happy to see you</Text>
      </View>
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={styles.wrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="black"
            onChangeText={text => setEmail(text)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="black"
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text style={styles.signupLink}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.authOptions}>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Registration')}>
          <FontAwesomeIcon icon={faGoogle} size={20} color="black" />
          <Text style={styles.authButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Registration')}>
          <FontAwesomeIcon icon={faApple} size={20} color="black" />
          <Text style={styles.authButtonText}>Continue with AppleID</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: 350,
    marginBottom: 12,
    color: 'black',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 14,
    height: 40,
    fontSize: 16,
    elevation: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  link: {
    color: 'black',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147a99',
    height: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: 'black',
    fontSize: 16,
  },
  signupLink: {
    color: '#3d6ddb',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  logoText: {
  	color: 'white',
    marginTop: -60,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  authOptions: {
    padding: 30,
    alignItems: 'center',
  },
  orText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 20,
    elevation: 10,
    backgroundColor: "white"
  },
  authButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default LoginScreen;
