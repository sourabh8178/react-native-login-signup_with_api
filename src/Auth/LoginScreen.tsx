import React, {useState,useContext,useEffect }from 'react'
import {View, Text,Image, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView} from 'react-native'
import Registration from './RegistrationScreen'
import ForgotPassword from './ForgotPassword'
import {AuthContext} from "./AuthContext"
import Spinner from "react-native-loading-spinner-overlay"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
const LoginScreen = (props) => {

	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const {isLoading, login} = useContext(AuthContext);

	return (
		<ScrollView >
			<Image source={require("../assest/login.jpg")} style={styles.backgroundImage} />
			<View style={styles.logoText}>
				<Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Welcome back</Text>
				<Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>Happy to see you </Text>
			</View>
			<View style={styles.container}>
			<Spinner visible={isLoading} />
				<View style={styles.wraper}>
				<Text style={{fontSize: 16, marginBottom: 12}} >Email</Text>
					<TextInput 
						value={email} 
						style={styles.input} 
						placeholder="Enter Email"
						placeholderTextColor="white"
						onChangeText={text => setEmail(text)} 
					/>
					<Text style={{fontSize: 16, marginBottom: 12}}>Password</Text>
					<TextInput  
						value={password} 
						style={styles.input} 
						placeholder="Enter Password" 
						placeholderTextColor="white"
						onChangeText={text => setPassword(text)}
						secureTextEntry 
					/>
					<TouchableOpacity onPress={() => props.navigation.navigate("ForgotPassword")} >
								<Text style={styles.link} >forgot password?</Text>
							</TouchableOpacity>
					<TouchableOpacity onPress={() => {login(email, password)}} style={styles.loginBtn}>
		        <Text style={{color: "#fff", fontSize: 20, fontWeight: 'bold'}}>Login</Text>
		      </TouchableOpacity>
					<View style={{ flexDirection: 'row', marginTop: 20 }} >
							<Text>Don't have an account ?</Text>
							<TouchableOpacity onPress={() => props.navigation.navigate("Registration")} >
								<Text style={styles.link} >Signup</Text>
							</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={{padding: 30}}>
				<Text style={{fontSize: 20, color: "black", marginLeft: 180}}>or</Text>
				<TouchableOpacity onPress={() => props.navigation.navigate("Registration")} style={styles.authG}>
					<Text style={{fontWeight: 'bold'}}><FontAwesomeIcon icon={faGoogle} size={20} color="black" />Countue with google</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.navigation.navigate("Registration")} style={styles.authG}>
					<Text style={{fontWeight: 'bold'}}> <FontAwesomeIcon icon={faApple} size={20} color="black" />Countue with AppliID</Text>
				</TouchableOpacity>
			</View>
		</ScrollView >
	);
}

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
		fontSize: 18,
		fontWeight: 'bold'
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
		borderRadius: 20,
		marginTop:20,
	},
	authG: {
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'grey',
		borderWidth: 2,
		marginTop: 20,
		borderRadius: 20,
		height: 45,
	},
	logoText: {
		marginTop: -60,
	}
});
export default LoginScreen;