import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, Dimensions, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';

const Profile = () => {
  const [profileDetail, setProfileDetail] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [viewType, setViewType] = useState('list');
  const navigation = useNavigation();

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setProfileDetail(response.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  const getAPIBlogData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/user_blog`, { headers });
      setBlogData(response.data);
    } catch (error) {
      // console.error('Error fetching data:', error);
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

  const deletePost = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/delete_blog/${postId}`, { headers });
      getAPIBlogData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showDeleteConfirmation = (postId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deletePost(postId) }
      ],
      { cancelable: true }
    );
  };

  const editPost = async (postId) => {
    console.log(postId);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (profileDetail === null) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Complete your profile details</Text>
        <TouchableOpacity
          style={styles.createProfileButton}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <MenuProvider skipInstanceCheck>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
          <View style={styles.headerIcons}>
            <Icon name="bell" size={20} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('ProfileSetting')} style={{ padding: 5 }}>
              <Icon name="cog" size={20} color="black" style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <Icon name="share-alt" size={20} color="black" style={{ marginLeft: 20 }} />
          </View>
        </View>
        {profileDetail.data.profile_background_image ? (
          <Image source={{ uri: profileDetail.data.profile_background_image.url }} style={styles.backgroundImage} />
        ) : (
          <Image source={require('../assest/app.png')} style={styles.backgroundImage} />
        )}
        <View style={styles.profileContainer}>
          <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
          <View style={styles.stats}>
            <TouchableOpacity onPress={() => navigateToPosts()} style={{ padding: 5 }}>
              <Text style={styles.statText}> Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Followers')} style={{ padding: 5 }}>
              <Text style={styles.statText}>{profileDetail.data.number_followers} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Following')} style={{ padding: 5 }}>
              <Text style={styles.statText}>{profileDetail.data.number_followings} Followings</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', color: 'black' }}>@{profileDetail.data.user_name}</Text>
          <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>Member since {profileDetail.data.created_at}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>Location: {profileDetail.data.country}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>{profileDetail.data.about}</Text>
        </View>
        <View style={styles.socialLinks}>
          <Icon name="facebook" size={20} color="black" />
          <Icon name="linkedin" size={20} color="black" style={{ marginLeft: 20 }} />
          <Icon name="youtube" size={20} color="black" style={{ marginLeft: 20 }} />
          <Icon name="instagram" size={20} color="black" style={{ marginLeft: 20 }} />
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.postSocialLinks}>
          <Icon name="film" size={20} color="black" />
          <Icon name="image" size={20} color="black" />
          <Icon name="video-camera" size={20} color="black" />
          <Icon name="music" size={20} color="black" />
        </View>
        <View style={styles.horizontalLine} />
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
          <View style={styles.inputPost}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
              <Icon name="camera-retro" size={20} color="black" style={{ marginRight: "5%"}}/>
              <Text style={{ fontSize: 20 }}>Write a post</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.horizontalLine} />
        {viewType === 'list' ? (
          <>
            {blogData ? (
              blogData.data.map((post) => (
                <React.Fragment key={post.id}>
                  <View 
                    style={{
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      padding: 15,
                      borderTopColor: '#ccc',
                      borderTopWidth: 5,
                      marginTop: 15,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                      <Image source={{ uri: post.profile.image.url }} style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10 }} />
                      <Text style={{ color: 'black' }}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
                      <Menu>
                        <MenuTrigger style={{ padding: 5, marginLeft: '65%'  }}>
                          <Icon name="ellipsis-v" size={30} color="black" style={{ marginLeft: 'auto' }}/>
                        </MenuTrigger>
                        <MenuOptions customStyles={menuOptionsStyles} >
                          <MenuOption onSelect={() => editPost(post.id)} text="Edit" />
                          <MenuOption onSelect={() => showDeleteConfirmation(post.id)} text="Delete" />
                        </MenuOptions>
                      </Menu>
                    </View>
                  </View>
                  <View 
                    style={{
                      borderBottomLeftRadius: 30,
                      borderBottomRightRadius: 30,
                      padding: 15,
                      borderBottomColor: '#ccc',
                      borderBottomWidth: 5,
                      marginTop: "auto"
                    }}
                  >
                    <Text style={{ color: 'black' }}> {post.title.charAt(0).toUpperCase() + post.title.slice(1)}</Text>
                    <Text style={{ color: 'black' }}> {post.body}</Text>
                    <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                      <TouchableOpacity onPress={() => handleLikeToggle(post.id)} style={{marginLeft: 10}}>
                        <Icon
                          name={post.liked ? 'heart' : 'heart-o'}
                          size={20}
                          color={post.liked ? 'red' : 'black'}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                      
                      <Icon name="comment" size={20} color="black" style={styles.icon} />
                      <Icon name="share-alt" size={20} color="black" style={styles.icon} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',marginLeft: 30, marginTop: 8 }}>
                      {post.likes.map((like, index) => (
                        index < 3 && (
                          <Image key={index} source={{ uri: like.url }} style={{ height: 20, width: 20, borderRadius: 10, marginLeft: -10, marginTop: -10 }} />
                        )
                      ))}
                      {post.likes_count > 0 && (
                        <Text style={{ marginLeft: 5, color: 'black' }}>+{post.likes_count - 0} more likes</Text>
                      )}
                    </View>
                  </View>
                </React.Fragment>
              ))
            ) : (
              <View style={styles.noData}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>No data available</Text>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    height: 50,
                    width: 200,
                    backgroundColor: "#2baed6",
                    justifyContent: 'center',
                    borderColor: '#2baed6'
                  }}
                  onPress={() => navigation.navigate('Blog')}
                >
                  <Text style={{ color: 'white' }}>Create your post</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <FlatList
            data={data ? data.blogs : []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGridItem}
            numColumns={2}
          />
        )}
      </ScrollView>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: 45,
    marginLeft: 'auto', // Align to the right
    marginRight: '5%', // Add some margin from the right
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    minWidth: 100, // Set a minimum width
  },
  optionWrapper: {
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
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
  inputPost: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "90%",
    marginLeft: "5%",
    marginTop: "2%",
    borderRadius: 30,
    height: 60,  // Set a specific height
    backgroundColor: "#d1cbcb",
    color: 'black'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: -14,
    marginLeft: 'auto',
    paddingRight: 15 
  },
  statText: {
    fontSize: 19,
    color: '#333',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: Dimensions.get('window').height / 5,
    resizeMode: 'cover',
  },
  profileContainer: {
    // alignItems: 'center',
    marginLeft: 30,
    marginTop: -80,
  },
  profileImage: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    borderRadius: (Dimensions.get('window').width / 3) * 0.5,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black'
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  postSocialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  noProfileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%',
  },
  createProfileButton: {
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 2,
    height: 50,
    width: 200,
    backgroundColor: "#2baed6",
    justifyContent: 'center',
    borderColor: '#2baed6'
  },
  noData:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: "20%"
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    width: "100%",
    marginVertical: 10, 
  },
  blogImage: {
    width: '100%',
    height: 300, // Adjust the height
    borderRadius: 8,
    marginBottom: 8,
  },
  icon:{
    marginLeft: 10,
  },
});


export default Profile;
