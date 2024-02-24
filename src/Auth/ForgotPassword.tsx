import React, {useState,useContext,useEffect }from 'react'
import {View, Text,Image, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView} from 'react-native'
import { BASE_URL } from "./Config";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);
  const [rePassword, setRePassword] = useState(null);
  const [userDate, setUserData] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const navigation = useNavigation();

  const checkUserEmail = () => {
    try {
    axios.post(`${BASE_URL}/users/check_email`, {
       email
    })
    .then((res) => {
      let userInfo = res.data;
      setUserData(userInfo);
    })
    .catch((error) => {
      const errorMessage = error.response.data.errors;
      alert(errorMessage);
      setIsLoading(false);
    });
    } catch (errors) {
      console.log(errors);
    }
  };

  const enterPassword = () => {
    if (password !== rePassword) {
      setPasswordMatchError(true);
      return;
    }
    setPasswordMatchError(false);
    try {
    axios.post(`${BASE_URL}/users/forget_password`, {
       email, password, rePassword
    })
    .then((res) => {
      alert('Successfully Password Changed');
      handleLogoinView()
    })
    .catch((error) => {
      const errorMessage = error.response.data.errors;
      alert(errorMessage);
      setIsLoading(false);
    });
    } catch (errors) {
      console.log(errors);
    }
  };

  const handleLogoinView = () => {
    navigation.navigate('Login');
  };

  return (
    <View>
    {userDate ? (
      <ScrollView >
        <Image source={require("../assest/login.jpg")} style={styles.backgroundImage} />
        <View style={styles.logoText}>
          <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Welcome back</Text>
          <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>Happy to see you </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.wraper}>
          <Text style={{fontSize: 16, marginBottom: 12}} >Email</Text>
            <TextInput
              value={password}
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="white"
              onChangeText={text => setPassword(text)}
            />
            <TextInput
              value={rePassword}
              style={styles.input}
              placeholder="Re Enter new password"
              placeholderTextColor="white"
              onChangeText={text => setRePassword(text)}
              secureTextEntry
            />
            {passwordMatchError && (
              <Text style={{ color: 'red' }}>Passwords do not match.</Text>
            )}
            <TouchableOpacity style={styles.loginBtn} onPress={enterPassword}>
              <Text style={{color: "#fff"}}>change passowrd</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView >
      ): (
      <ScrollView >
        <Image source={require("../assest/login.jpg")} style={styles.backgroundImage} />
        <View style={styles.logoText}>
          <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Welcome back</Text>
          <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>Happy to see you </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.wraper}>
          <Text style={{fontSize: 16, marginBottom: 12}} >Email</Text>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="white"
              onChangeText={text => setEmail(text)}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={checkUserEmail}>
              <Text style={{color: "#fff"}}>submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView >
      )}
    </View>
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
    borderWidth:1,
    color: 'white',
    borderColor: "#b6b9bf",
    backgroundColor: '#b6b9bf',
    borderRadius: 5,
    paddingHorizontal: 14,
    borderRadius: 25,
  },
  link: {
    color: "blue",
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d6ddb',
    height: 40,
    marginLeft: 90,
    width: 150,
    borderRadius: 20,
    marginTop:20,
  },
  authG: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    borderColor: 'grey',
    borderWidth: 2,
    marginTop: 20,
    marginLeft: 120,
    borderRadius: 20,
    height: 40,
  },
  logoText: {
    marginTop: -60,
  }
});
export default ForgotPassword;