import React, {useState, useContext }from 'react'
import {View, Text, Image, TextInput, ScrollView, Button, TouchableOpacity, StyleSheet} from 'react-native'
import Login from './LoginScreen'
import {AuthContext} from "./AuthContext"
import Spinner from "react-native-loading-spinner-overlay"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';

const RegistrationScreen = (props) => {

	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const {isLoading, register} = useContext(AuthContext);
	
	return (
		<ScrollView >
			<Image source={require("../assest/login.jpg")} style={styles.backgroundImage} />
			<View style={styles.logoText}>
				<Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Get started</Text>
				<Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>Join now! It take only few steps</Text>
			</View>
			<View style={styles.container}>
			<Spinner  visible={isLoading} />
				<View style={styles.wraper}>
					<Text style={{fontSize: 16, marginBottom: 12}} >Name</Text>
					<TextInput
						value={name}
						style={styles.input}
						placeholder="Enter Name"
						placeholderTextColor="white"
						onChangeText={text => setName(text) }
					/>
					<Text style={{fontSize: 16, marginBottom: 12}} >Email</Text>
					<TextInput
						value={email}
						style={styles.input}
						placeholder="Enter Email"
						placeholderTextColor="white"
						onChangeText={text => setEmail(text) }
					/>
					<Text style={{fontSize: 16, marginBottom: 12}} >Password</Text>
					<TextInput
						value={password}
						style={styles.input}
						placeholder="Enter Password"
						placeholderTextColor="white"
						onChangeText={text => setPassword(text) }
						secureTextEntry
					/>
					<TouchableOpacity onPress={() => { register(name, email, password);}} style={styles.loginBtn}>
		        <Text style={{color: "#fff"}}>Registration</Text>
		      </TouchableOpacity>
					<View style={{ flexDirection: 'row', marginTop: 20 }} >
							<Text>Already have an account ?</Text>
							<TouchableOpacity onPress={() => props.navigation.navigate("Login")} >
								<Text style={styles.link} >Login</Text>
							</TouchableOpacity>
					</View>
				</View>
			</View>
			<View>
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
export default RegistrationScreen;