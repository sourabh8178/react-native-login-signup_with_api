import React from 'react'
import { View, ActivityIndicator } from 'react-native'

const SplashScreen = () => {
	return (
		<View style={{flex: 4, justifyContent: "center", backgroundColor: "#06bcee" }}>
			<ActivityIndicator size="large" color="#ffffff" />
		</View>
	)
}

export default SplashScreen;