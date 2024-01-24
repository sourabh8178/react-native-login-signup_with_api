import React, {useContext} from 'react'
import {View, Text, StyleSheet, Button} from 'react-native'
import Spinner from "react-native-loading-spinner-overlay"
import {AuthContext} from "./AuthContext"

const HomeScreen = () => {
	const {userInfo, logout, isLoading} = useContext(AuthContext);
	return (
		<View style={styles.container}>
			<Spinner visible={isLoading} />
			{userInfo ? (
				<>
					<Text style={styles.welcome}>Welcome </Text>
				  <Button title="Logout" color="red" onPress={logout} />
				</>
				) : (
				<Text style={styles.welcome}>Welcome</Text>
				)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	wraper:{
		fontSize: 18,
		marginBottom: 8,
	},
	input: {
		marginBottom: 12,
		borderWidth:1,
		borderColor: "#bbb",
		borderRadius: 5,
		paddingHorizontal: 14
	},
	link: {
		color: "blue",
	},
});

export default HomeScreen;