import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const UserProfile = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [profileDetail, setProfileDetail] = useState(null);
  const { userInfo, isLoading } = useContext(AuthContext);

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/profile/${id}`, { headers });
      setProfileDetail(response.data);
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

  if (profileDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileDetail.profile_background_image ? profileDetail.profile_background_image.url : "https://via.placeholder.com/400x200" }} style={styles.backgroundImage} />
        <View style={styles.profileContent}>
          <Image source={{ uri: profileDetail.profile_image.url }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{profileDetail.name}</Text>
            <Text style={styles.userName}>@{profileDetail.user_name}</Text>
          </View>
            <TouchableOpacity 
              style={profileDetail.follow ? styles.unfollowButton : styles.followButton} 
              onPress={() => profileDetail.follow ? unfollow(profileDetail.user_id) : follow(profileDetail.user_id)}
            >
              <Text style={styles.followButtonText}>
                {profileDetail.follow ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <TouchableOpacity onPress={() => navigateToPosts()}>
            <Text style={styles.statText}>{profileDetail.number_posts} Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToFollowers()}>
            <Text style={styles.statText}>{profileDetail.number_followers} Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToFollowings()}>
            <Text style={styles.statText}>{profileDetail.number_followings} Followings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.socialLinks}>
        <Icon name="facebook-f" size={20} color="blue"/>
        <Icon name="linkedin" size={20} color="blue"/>
        <Icon name="youtube-play" size={20} color="blue"/>
        <Icon name="instagram" size={20} color="blue"/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  profileContent: {
    alignItems: 'center',
    marginTop: -80,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  userName: {
    color: 'grey',
    fontSize: 16,
  },
  followButton: {
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#4CAF50', // Green color for Follow
  },
  unfollowButton: {
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'red', // Red color for Unfollow
  },
  followButtonText: {
    color: '#fff', // White color for text
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 50,
  },
  statText: {
    fontSize: 19,
    color: '#333',
    fontWeight: 'bold',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
