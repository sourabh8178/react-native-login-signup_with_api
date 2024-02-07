import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faLocation, faShare, faFacebook, faLinkedin, faYoutube } from '@fortawesome/free-solid-svg-icons';


const UserProfile = ({ route }) => {
  const { id } = route.params;
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
  
  if (profileDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: profileDetail.data.profile_background_image.url }} style={styles.backgroundImage} />
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
        <Text style={{marginTop: 10}}>@{profileDetail.data.user_name}</Text>
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.setting}>Setting</Text>
          </TouchableOpacity>
          <FontAwesomeIcon icon={faShare} size={20} color="black" style={styles.shareIcon} />
        </View>
        <Text style={{marginTop: 10}}>Memner since {profileDetail.data.created_at}</Text>
        <Text style={{marginTop: 10}}>19K Followers</Text>
        <Text style={{marginTop: 10}}>1,5K Likes</Text>
        <Text style={{marginTop: 10}}>{profileDetail.data.location}</Text>
        <Text style={{marginTop: 10}}>{profileDetail.data.about}</Text>
      </View>

      <View style={styles.socialLinks}>
        <Text style={styles.link}>{profileDetail.data.youtub_url}</Text>
        <Text style={styles.link}>{profileDetail.data.instagram_url}</Text>
        <Text style={styles.link}>{profileDetail.data.linkedin_url}</Text>
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