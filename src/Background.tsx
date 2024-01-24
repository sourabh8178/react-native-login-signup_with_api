import React from 'react';
import {View, ImageBackground, Image} from 'react-native';

const Background =({children}) =>{
	return (
		<View>
		<Image source={require("./assest/Frame-130.png")} style={{ height: '100%', width: "100%"}} />
		 <View style={{ position: "absolute" }} >
		 	{children}
		 </View>
		</View>
	);
}

export default Background;