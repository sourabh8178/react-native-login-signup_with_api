import React, {useState,useContext,useEffect }from 'react'
import {View, Text, TextInput, Button, TouchableOpacity, StyleSheet} from 'react-native'
import Registration from './RegistrationScreen'
import {AuthContext} from "./AuthContext"
import Spinner from "react-native-loading-spinner-overlay"

const LoginScreen = (props) => {

	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const {isLoading, login} = useContext(AuthContext);

	return (
		<View style={styles.container}>
				<Text style={styles.logins}>Login</Text>
			<Spinner visible={isLoading} />
				<View style={styles.wraper}>
					<TextInput 
						value={email} 
						style={styles.input} 
						placeholder="Enter Email"
						onChangeText={text => setEmail(text)} 
					/>
					<TextInput  
						value={password} 
						style={styles.input} 
						placeholder="Enter Password" 
						onChangeText={text => setPassword(text)}
						secureTextEntry 
					/>

					<Button title="Login" onPress={() => {login(email, password)}} />
					<View style={{ flexDirection: 'row', marginTop: 20 }} >
							<Text>Don't have an account ?</Text>
							<TouchableOpacity onPress={() => props.navigation.navigate("Registration")} >
								<Text style={styles.link} >Signup</Text>
							</TouchableOpacity>
					</View>
				</View>
			</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "#6eccf5",
		marginTop: "50%",
		borderTopLeftRadius: 60,
		borderTopRightRadius: 60,
		height: "100%"
	},
	wraper:{
		width: "80%"
	},
	input: {
		marginBottom: 12,
		borderWidth:1,
		borderColor: "#fff",
		borderRadius: 5,
		paddingHorizontal: 14
	},
	link: {
		color: "blue",
	},
	logins:{
		fontSize: 50,
		marginTop: "-30%",
		marginBottom: 30,
		fontWeight: "bold"
	}
});
export default LoginScreen;