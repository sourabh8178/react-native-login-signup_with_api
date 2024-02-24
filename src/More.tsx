import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Followers from './Profile/Followers';
import Following from './Profile/Following'
import { BASE_URL } from "./Auth/Config";
import { AuthContext } from "./Auth/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark, faUsers, faClipboard, faWallet, faUserFriends, faShoppingBag, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const More = () => {
  const [profileDetail, setProfileDetail] = useState(null);
  const { userInfo, isLoading, logout } = useContext(AuthContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setProfileDetail(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false); // Stop the refreshing indicator
      setLoading(false);
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

  const onRefresh = () => {
    getAPIData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
        <TouchableOpacity style={styles.subMenu} onPress={logout}>
          <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={faSignOutAlt} size={25} color="black" />   Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
      contentContainerStyle={styles.container}>
      {profileDetail ? (
        <>
        <View style={styles.profileContainer}>
          <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
            <Text style={styles.userName}>@{profileDetail.data.user_name}</Text>
          </View>
        </View>
        
      <View style={styles.menu}>
        <MenuItem icon={faClipboard} label="Dashboard" onPress={() => navigation.navigate('Search')} />
        <MenuItem icon={faUserFriends} label="My Posts" onPress={() => navigation.navigate('Search')} />
        <MenuItem icon={faBookmark} label="Bookmarks" onPress={() => navigation.navigate('Search')} />
        <MenuItem icon={faWallet} label={`Wallet: $${profileDetail.data.wallet_balance}`} onPress={() => navigation.navigate('Search')} />
        <MenuItem icon={faUsers} label="Followers" onPress={() => navigation.navigate('Followers')} />
        <MenuItem icon={faUsers} label="Following" onPress={() => navigation.navigate('Following')} />
        <MenuItem icon={faClipboard} label="Purchased" onPress={() => navigation.navigate('Search')} />
        <MenuItem icon={faSignOutAlt} label="Logout" onPress={handleLogout} />
      </View>

      </>
      ) : (
        <Text>No profile details available</Text>
      )}
    </ScrollView>
  );
}

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.subMenu} onPress={onPress}>
    <Text style={{ fontSize: 22 }} ><FontAwesomeIcon icon={icon} size={25} color="black" />   {label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 5,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    color: 'grey',
  },
  menu: {
    paddingLeft: "6%",
    paddingTop: 25,
  },
  subMenu: {
    fontSize: 18,
    paddingBottom: 15,
    paddingTop: 15,
  },
  horizontalLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginVertical: 5,
    width: "95%",
  },
});

export default More;