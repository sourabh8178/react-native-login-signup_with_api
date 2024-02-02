import React from 'react'
import {View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditMyProfile from './EditMyProfile';

const ProfileSetting = () => {
	const navigation = useNavigation();
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View>
				<Text style={styles.menuHead}>Account</Text>
				<View style={styles.menu}>
	      	<TouchableOpacity  style={styles.subMenu} onPress={() => navigation.navigate('EditMyProfile')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Edit My Page</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Verifyed Account!</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Wallet:$2.3</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Logout</Text>
	        </TouchableOpacity>
	        <View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Subscription</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Subscription Price</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >My Subscibers</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >My Subscriptions</Text>
	        </TouchableOpacity>
					<View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Privecy and Security</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Privecy and Security</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Password</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Block Countries</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Ristricted Users</Text>
	        </TouchableOpacity>
					<View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Payments</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Payments</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Payments recived</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Payout menthod</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} >Withdrawals</Text>
	        </TouchableOpacity>
					<View style={styles.horizontalLine} />
	      </View>
			</View>
		</ScrollView>
	)
};
const styles = StyleSheet.create({
	container: {
    flexGrow: 1,
    marginTop: 3,
    padding: 5
  },
	horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 5,
    width: "100%",
    marginVertical: 10, 
  },
  subMenu: {
  	paddingLeft: "3%",
  	fontSize: 6,
  	color: "black",
  	paddingBottom: 10,
  	paddingTop: 10
  },
  menuHead: {
  	fontSize: 18, 
  	fontWeight: 'bold',
  },
});
export default ProfileSetting;