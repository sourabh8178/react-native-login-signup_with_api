import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import axios from 'axios';

const Following = () => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState(undefined);

  // Dummy data for followers
  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/following_lists`, { headers });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

   const follow = async (id) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.get(`${BASE_URL}/follow_user/${id}`, { headers });
      setProfileDetail(prevProfile => ({ ...prevProfile, follow: true }));
      getAPIData()
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollow = async (id) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.get(`${BASE_URL}/unfollow_user/${id}`, { headers });
      setProfileDetail(prevProfile => ({ ...prevProfile, follow: false }));
      getAPIData()
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  
  const renderFollowerItem = ({ item }) => (
    <View style={styles.followerItem}>
      <Image source={{ uri: item.profile_image.url }} style={styles.followerImage} />
      <View style={styles.followerDetails}>
        <Text style={styles.followerName}>{item.name}</Text>
        <Text style={styles.followerUsername}>{item.user_name}</Text>
      </View>
      <TouchableOpacity onPress={() => unfollow(item.user_id)} style={styles.unfollowButton}>
        <Text style={styles.unfollowButtonText}>Following</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderFollowerItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  followerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  followerDetails: {
    flex: 1,
  },
  followerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  followerUsername: {
    color: '#888',
  },
  unfollowButton: {
    backgroundColor: '#bfbaba',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  unfollowButtonText: {
    color: '#fff',
  },
});

export default Following;