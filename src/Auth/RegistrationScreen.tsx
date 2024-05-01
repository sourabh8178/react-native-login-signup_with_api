import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { AuthContext } from './AuthContext';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const handleRegistration = async () => {
    setLoading(true);
    await register(name, email, password);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assest/login.jpg')} style={styles.backgroundImage} />
      <View style={styles.logoText}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Join now! It takes only a few steps</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          value={name}
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="black"
          onChangeText={text => setName(text)}
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="black"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          value={password}
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="black"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleRegistration} style={styles.loginBtn}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginText}>Register</Text>
          )}
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.authOptions}>
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
    flexGrow: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  logoText: {
    marginTop: -60,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    elevation: 70,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    elevation: 70,
  },
  formContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    color: '#3d6ddb',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 14,
    height: 40,
    fontSize: 18,
    elevation: 10,
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147a99',
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    width: '100%',
    elevation: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    color: 'black',
    fontSize: 18,
    marginRight: 5,
  },
  link: {
    color: '#3d6ddb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authOptions: {
    padding: 30,
    alignItems: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor: '#3d6ddb',
    // borderWidth: 2,
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

export default RegistrationScreen;
