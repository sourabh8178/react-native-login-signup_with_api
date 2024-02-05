import React from 'react'
import {View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditMyProfile from './EditMyProfile';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark, faUsers, faClipboard, faEdit, faCheckCircle, faWallet, faLock, faBan, faCreditCard, faUserFriends, faShoppingBag, faShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const ProfileSetting = () => {
	const navigation = useNavigation();
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View>
				<Text style={styles.menuHead}>Account</Text>
				<View style={styles.menu}>
	      	<TouchableOpacity  style={styles.subMenu} onPress={() => navigation.navigate('EditMyProfile')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faEdit} size={20} color="black" />  Edit My Page</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faCheckCircle} size={20} color="black" />  Verifyed Account!</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faWallet} size={20} color="black" />  Wallet:$2.3</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faSignOutAlt} size={20} color="black" />  Logout</Text>
	        </TouchableOpacity>
	        <View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Subscription</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faUsers} size={20} color="black" />  Subscription Price</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faUsers} size={20} color="black" />  My Subscibers</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faUsers} size={20} color="black" />  My Subscriptions</Text>
	        </TouchableOpacity>
					<View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Privecy and Security</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faShield} size={20} color="black" />  Privecy and Security</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faLock} size={20} color="black" />  Password</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faUserFriends} size={20} color="black" />  Block Countries</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faBan} size={20} color="black" />  Ristricted Users</Text>
	        </TouchableOpacity>
					<View style={styles.horizontalLine} />
	      </View>
	      <Text style={styles.menuHead} >Payments</Text>
	      <View style={styles.menu} >
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faWallet} size={20} color="black" />  Payments</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faCreditCard} size={20} color="black" />  Payments recived</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faCreditCard} size={20} color="black" />  Payout menthod</Text>
	        </TouchableOpacity>
	        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
	          <Text style={{ fontSize: 18, color: "black", fontWeight: 'bold' }} ><FontAwesomeIcon icon={faCreditCard} size={20} color="black" />  Withdrawals</Text>
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