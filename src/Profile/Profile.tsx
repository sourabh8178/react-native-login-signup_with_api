import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import Blog from '../Blog/Blog';
import ProfileSetting from './ProfileSetting';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext"
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faComment, faBookmark, faHeart, faUsers, faLocation, faShare,  faUserFriends, faCog, faPen, faMusic, faVideo, faFilm, faCamera, faImage, faBell, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFacebook ,faLinkedin, faYoutube, faInstagram} from '@fortawesome/free-brands-svg-icons';

const Profile = () => {
  
  const [profileDetail, setprofileDetail] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [viewType, setViewType] = useState('list');
  const {userInfo, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setprofileDetail(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false); // Stop the refreshing indicator
    }
  };

  const getAPIBlogData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/user_blog`, { headers });
      setBlogData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

   useEffect(() => {
    getAPIData();
    getAPIBlogData();
  }, []);

  const onRefresh = () => {
    getAPIData();
    getAPIBlogData();
  };
  
  if (profileDetail === null) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={styles.noProfileText}>Complete your profile details</Text>
        <TouchableOpacity
          style={styles.createProfileButton}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={{color: 'white'}}>Create Profile</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.headerIcons}>
          <FontAwesomeIcon icon={faBell} size={20} color="black" />
          {/* You can add the number of notifications or any other UI for notifications here */}
          <FontAwesomeIcon icon={faSearch} size={20} color="black" style={styles.headerIcon} />
          <FontAwesomeIcon icon={faPlus} size={20} color="black" style={styles.headerIcon} />
        </View>
      </View>
      {/*<Text>{console.warn(profileDetail)}</Text>*/}
      {profileDetail.data.profile_background_image ? (
       <Image source={{ uri: profileDetail.data.profile_background_image.url }} style={styles.backgroundImage} />
        ) : (
        <Image source={require("../assest/app.png")} style={styles.backgroundImage} />
        )}
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
        <Text style={{marginTop: 10}}>@{profileDetail.data.user_name}</Text>
        <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileSetting')}>
            <Text style={styles.setting}>Setting  <FontAwesomeIcon icon={faPen} size={15} color="black"/></Text>
          </TouchableOpacity>
          <FontAwesomeIcon icon={faShare} size={20} color="black" style={styles.shareIcon} />
        </View> 
        <Text style={{marginTop: 10, fontSize: 15}}>Memner since {profileDetail.data.created_at}</Text>
        <Text style={{marginTop: 10, fontSize: 15}}><FontAwesomeIcon icon={faUsers} size={20} color="black" />  19K Followers</Text>
        <Text style={{marginTop: 10, fontSize: 15}}><FontAwesomeIcon icon={faHeart} size={20} color="black" />  1,5K Likes</Text>
        <Text style={{marginTop: 10, fontSize: 15}}><FontAwesomeIcon icon={faLocation} size={20} color="black"/>   {profileDetail.data.country}</Text>
        <Text style={{marginTop: 10, fontSize: 15}}>{profileDetail.data.about}</Text>
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
      <View style={styles.postSocialLinks}>
        <FontAwesomeIcon icon={faFilm} size={20} color="black"  />
        <FontAwesomeIcon icon={faImage} size={20} color="black" />
        <FontAwesomeIcon icon={faVideo} size={20} color="black" />
        <FontAwesomeIcon icon={faMusic} size={20} color="black" />
      </View>
      <View style={styles.horizontalLine} />
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
        <View style={styles.inputPost}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
              <FontAwesomeIcon icon={faCamera} size={20} color="black" style={{ marginRight: "5%" }} />
              <Text style={{ fontSize: 20 }}>Write a post</Text>
            </View>
        </View>
      </TouchableWithoutFeedback>
      {/*<View style={styles.horizontalLine} />*/}
        {viewType === 'list' ? (
        <>
          {blogData ? (
            blogData.data.map((post) => (
              <React.Fragment key={post.id}>
              <View style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 15, borderTopColor: '#ccc', borderTopWidth: 5, marginTop: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <Image source={{ uri: post.profile.image.url }} style={{ height: '200%', width: "12%", borderRadius: 50, marginRight: 10, marginBottom: 5, marginTop: 15 }} />
                  <Text style={{color: 'black', fontSize: 20}}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
                  <FontAwesomeIcon icon={faEllipsisV} style={{ marginLeft: 'auto' }} />
                </View>
                  <Text style={{color: 'grey', marginLeft: 60, marginTop: -18, fontSize:12}}>@{post.profile.user_name}</Text>
              </View>
              <TouchableOpacity
                style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 15, borderBottomColor: '#ccc', borderBottomWidth: 5, marginTop: "auto" }}
                onPress={() => handleBlogView(post.id)}
              >
                <Text  style={{color: 'black'}}> {post.title.charAt(0).toUpperCase() + post.title.slice(1)}</Text>
                <Text style={{color: 'black'}}> {post.body}</Text>
                <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <FontAwesomeIcon icon={faHeart} size={20} color="black" style={styles.icon} />
                  <FontAwesomeIcon icon={faComment} size={20} color="black" style={styles.icon} />
                  <FontAwesomeIcon icon={faShare} size={20} color="black" style={styles.icon} />
                  <FontAwesomeIcon icon={faBookmark} size={20}  style={{marginLeft: 'auto'}} />
                </View>
              </TouchableOpacity>
              </React.Fragment>
            ))
          ) : (
            null
          )}
        </>
        ) : (
          <FlatList
            data={blogData ? blogData.blogs : []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGridItem}
            numColumns={2}
          />
        )}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
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
  icon:{
    marginLeft: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 20
  },
  postSocialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    marginBottom: 20
  },
  link: {
    color: 'blue',
    fontSize: 16,
  },
  setting: {
    borderColor: '#ccc', 
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',  // Center the text vertically
    alignSelf: 'flex-end',  // Align the container to the right
    marginLeft: "10%",  // Add some margin for spacing
    fontSize: 15,
    marginTop: 10,
    width: "75%",
  },
  shareIcon: {
    marginTop: 15,
    marginLeft: "auto",
    padding: 10
  },
  inputPost: {
   flexDirection: 'row',
    alignItems: 'center',
    width: "90%",
    marginLeft: "5%",
    marginTop: "2%",
    borderRadius: 30,
    height: 60,  // Set a specific height
    backgroundColor: "#d1cbcb"
  },
  noProfileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "50%"
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 6, // Adjust the margin as needed
    width: "100%"
  },
  blogImage: {
    width: '100%',
    height: 300, // Adjust the height
    borderRadius: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  createProfileButton: {
    alignItems: 'center',
    marginTop:30,
    borderRadius: 20,
    borderWidth: 2,
    height: 50,
    width: 200,
    backgroundColor: "#66d4f2",
    justifyContent: 'center',
    borderColor: '#98dbed'
  }
});
export default Profile;