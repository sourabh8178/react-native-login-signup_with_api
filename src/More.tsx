import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from "./Config";
import { AuthContext } from "./AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark, faUsers, faClipboard, faWallet, faUserFriends, faShoppingBag, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const More = () => {
	const [profileDetail, setprofileDetail] = useState(null);
  const {userInfo, isLoading, logout} = useContext(AuthContext);
  const navigation = useNavigation();

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setprofileDetail(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

   useEffect(() => {
    getAPIData();
  }, []);

  const handleLogout = () => {
    const headers = {
      Authorization: `Bearer ${userInfo.data.authentication_token}`,
    };
    logout(headers);
  };
  
  if (profileDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

	return (
		<ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer} style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
	        <View>
		        <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
	          <Text style={styles.userName}>@{profileDetail.data.user_name}</Text>
		      </View>
        </View>
      </View>
      <View style={styles.menu}>
      	<TouchableOpacity  style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faClipboard} size={25} color="black" />   Dashboard</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faUserFriends} size={25} color="black" style={{padding: 2}} />   My Posts</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faBookmark} size={25} color="black" />   Bookmarks</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faWallet} size={25} color="black" />   Wallet:$2.3</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faUsers} size={25} color="black" />   Followers</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faUsers} size={25} color="black" />   Following</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={() => navigation.navigate('Search')}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faClipboard} size={25} color="black" />   Purchesd</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity style={styles.subMenu} onPress={handleLogout}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faSignOutAlt} size={25} color="black" />   Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
		// <View>
		// 	<Text>{console.warn(profileDetail)}</Text>
		// </View>
	)
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 5,
    padding: 15
  },
  profileContainer: {
    alignItems: 'left',
    // paddingTop: 10,
    marginTop: 20,
    marginLeft: 30
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10
  },
  userName: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 5
  },
  share: {
    marginTop: 10,
    marginLeft: "40%",
    // padding: 10
  },
  menu: {
  	paddingLeft: "6%",
  	paddingTop: 25
  },
  subMenu: {
  	fontSize: 10,
  	paddingBottom: 10,
  	paddingTop: 10
  },
  horizontalLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginVertical: 5, // Adjust the margin as needed
    width: "95%"
  },
});
export default More;