import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faComment, faBookmark, faHeart, faUsers, faLocation, faShare,  faUserFriends, faCog, faPen, faMusic, faVideo, faFilm, faCamera, faImage } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const UserProfile = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();
  const [profileDetail, setprofileDetail] = useState(null);
  const {userInfo, isLoading} = useContext(AuthContext);

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/profile/${id}`, { headers });
      setprofileDetail(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
   useEffect(() => {
    getAPIData();
  }, []);
  
  const follow = (id) => {
    try {
        const token = userInfo.data.authentication_token;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = axios.get(`${BASE_URL}/follow_user/${id}`, { headers });
        setProfileDetail(prevProfile => ({ ...prevProfile, follow: true }));
      } catch (error) {
        console.error('Error following user:', error);
    }
  };

  const unfollow = (id) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = axios.get(`${BASE_URL}/unfollow_user/${id}`, { headers });
      setProfileDetail(prevProfile => ({ ...prevProfile, follow: false }));
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
      {profileDetail.profile_background_image ? (
       <Image source={{ uri: profileDetail.profile_background_image.url }} style={styles.backgroundImage} />
        ) : (
        <Image source={require("../assest/app.png")} style={styles.backgroundImage} />
        )}
        <Image source={{ uri: profileDetail.profile_image.url }} style={styles.profileImage} />
        <Text style={{marginTop: 10}}>@{profileDetail.user_name}</Text>
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        <Text style={styles.name}>{profileDetail.name.charAt(0).toUpperCase() + profileDetail.name.slice(1)}</Text>
          {/*<Text>{console.warn(profileDetail)}</Text>*/}
          {profileDetail.follow ? (
            <TouchableOpacity onPress={() => unfollow(profileDetail.user_id)}>
              <Text style={styles.setting}>Unfollow</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => follow(profileDetail.user_id)}>
              <Text style={styles.setting}>Follow</Text>
            </TouchableOpacity>
          )}
          
          <FontAwesomeIcon icon={faShare} size={20} color="black" style={styles.shareIcon} />
        </View>
        <Text style={{marginTop: 10}}>Memner since {profileDetail.created_at}</Text>
        <Text style={{marginTop: 10}}>19K Followers</Text>
        <Text style={{marginTop: 10}}>1,5K Likes</Text>
        <Text style={{marginTop: 10}}>{profileDetail.location}</Text>
        <Text style={{marginTop: 10}}>{profileDetail.about}</Text>
      </View>

      <View style={styles.socialLinks}>
        <TouchableOpacity onPress={() => openLink('https://www.facebook.com')}>
          <FontAwesomeIcon icon={faFacebook} size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink(profileDetail.data)}>
          <FontAwesomeIcon icon={faLinkedin} size={20} color="black" style={{marginLeft: 20}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://www.youtube.com')}>
          <FontAwesomeIcon icon={faYoutube} size={20} color="black" style={{marginLeft: 20}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://www.instagram.com')}>
          <FontAwesomeIcon icon={faInstagram} size={20} color="black" style={{marginLeft: 20}} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  profileContainer: {
    alignItems: 'left',
    marginTop: -80,
    marginLeft: 20
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 8,
  },
  userName: {
    fontSize: 16,
    color: 'grey',
    marginLeft: 5
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  link: {
    color: 'blue',
    fontSize: 16,
  },
  setting: {
    borderColor: '#ccc', 
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',  // Center the text vertically
    alignSelf: 'flex-end',  // Align the container to the right
    marginLeft: "10%",  // Add some margin for spacing
    fontSize: 13,
    marginTop: 10
  },
  shareIcon: {
    marginTop: 15,
    marginLeft: "auto",
    padding: 10
  },
});
export default UserProfile;