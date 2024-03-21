import React, { useContext, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity,TouchableWithoutFeedback, ScrollView, FlatList, Image, TextInput, RefreshControl } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Blog from './Blog/Blog';
import UserProfile from "./Profile/UserProfile"
import { useNavigation } from '@react-navigation/native';
import BlogView from './Blog/BlogView';
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = (props) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const [data, setData] = useState(undefined);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const [viewType, setViewType] = useState('list');
  const [body, setBody] = useState(null);

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/blogs`, { headers });
      setData(response.data);
    } catch (error) {
      console.log(error.response.data.errors);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (data === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    getAPIData();
    // loadBookmarkedPosts();
    // loadLikedPosts();
  }, []);

  useEffect(() => {
    // saveBookmarkedPosts();
    // saveLikedPosts();
  }, [likedPosts]);

  // const loadLikedPosts = async () => {
  //   try {
  //     const storedLikedPosts = await AsyncStorage.getItem('likedPosts');
  //     if (storedLikedPosts !== null) {
  //       setLikedPosts(JSON.parse(storedLikedPosts));
  //     }
  //   } catch (error) {
  //     console.log('Error loading liked posts:', error);
  //   }
  // };

  // const loadBookmarkedPosts = async () => {
  //   try {
  //     const storedBookmarkedPosts = await AsyncStorage.getItem('bookmarkedPosts');
  //     if (storedBookmarkedPosts !== null) {
  //       setBookmarkedPosts(JSON.parse(storedBookmarkedPosts));
  //     }
  //   } catch (error) {
  //     console.log('Error loading bookmarked posts:', error);
  //   }
  // };

  //  const saveLikedPosts = async () => {
  //   try {
  //     await AsyncStorage.setItem('likedPosts', JSON.stringify(likedPosts));
  //   } catch (error) {
  //     console.log('Error saving liked posts:', error);
  //   }
  // };

  // const saveBookmarkedPosts = async () => {
  //   try {
  //     await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
  //   } catch (error) {
  //     console.log('Error saving bookmarked posts:', error);
  //   }
  // };

  const handleLikeToggle = (postId) => {
    // Toggle the liked status for the post
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
      handleUnlike(postId);
    } else {
      setLikedPosts([...likedPosts, postId]);
      handleLike(postId);
    }
  };

  const handleBookmarkToggle = (postId) => {
    if (bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(bookmarkedPosts.filter((id) => id !== postId));
      handleUnBook(postId);
    } else {
      setBookmarkedPosts([...bookmarkedPosts, postId]);
      handleBook(postId);
    }
  };

  const handleBook = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${BASE_URL}/bookmark/${postId}`, {}, { headers });
      getAPIData()
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  const handleUnBook = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${BASE_URL}/unbookmark/${postId}`, {}, { headers });
      getAPIData()
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };


  const handleLike = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${BASE_URL}/like/${postId}`, {}, { headers });
      setLikedPosts([...likedPosts, postId]);
      getAPIData()
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${BASE_URL}/unlike/${postId}`, {}, { headers });
      getAPIData()
    } catch (error) {
      console.log(error.response.data.errors);
    }
  };

  const handleBlogView = (blogId) => {
    navigation.navigate('BlogView', {
      id: blogId,
    });
  };

  const handleProfileView = (profileId) => {
    navigation.navigate("UserProfile", {
      id: profileId,
    });
  };

  const onRefresh = () => {
    getAPIData();
  };
  
  return (
    <ScrollView 
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {viewType === 'list' ? (
        <>
        {data ? (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
            <View style={styles.inputPost}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
                  <Icon name="camera-retro" size={20} color="black" style={{ marginRight: "5%"}}/>
                  <Text style={{ fontSize: 20 }}>Write a post</Text>
                </View>
            </View>
          </TouchableWithoutFeedback>
          ) : (
          null
          )}
          {data ? (
            data.data.map((post) => (
            	<React.Fragment key={post.id}>
            	<TouchableOpacity
							  style={{
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  padding: 15,
                  borderTopColor: '#ccc',
                  borderTopWidth: 5,
                  marginTop: 15,
                }}
							  onPress={() => handleProfileView(post.profile.id)}
							>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
							    <Image source={{ uri: post.profile.image.url }} style={{ height: '200%', width: "12%", borderRadius: 50, marginRight: 10, marginBottom: 5, marginTop: 15 }} />
							    <Text style={{color: 'black'}}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
                  <Icon name="ellipsis-v" size={20} color="black" style={{marginLeft: 'auto'}}/>
							  </View>
							</TouchableOpacity>
              <TouchableOpacity
							  style={{ 
                  borderBottomLeftRadius: 30,
                  borderBottomRightRadius: 30, 
                  padding: 15, 
                  borderBottomColor: '#ccc', 
                  borderBottomWidth: 5, 
                  marginTop: "auto" 
                }}
							  onPress={() => handleBlogView(post.id)}
							   >
							  <Text  style={{color: 'black'}}> {post.title.charAt(0).toUpperCase() + post.title.slice(1)}</Text>
							  <Text style={{color: 'black'}}> {post.body}</Text>
							  <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <TouchableOpacity onPress={() => handleLikeToggle(post.id)}>
                  <Icon
                    name={post.liked ? 'heart' : 'heart-o'}
                    size={20}
                    color={post.liked ? 'red' : 'black'}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                  <Icon name="comment" size={20} color="black" style={styles.icon}/>
                  <Icon name="share-alt" size={20} color="black" style={styles.icon}/>
                  <TouchableOpacity onPress={() => handleBookmarkToggle(post.id)} style={{marginLeft: 'auto'}}>
                    <Icon
                      name={post.bookmarked ? 'bookmark' : 'bookmark-o'}
                      size={20}
                      color={post.bookmarked ? 'black' : 'black'}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
							  </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',marginLeft: 1,marginLeft: 10 }}>
                    {post.likes.map((like, index) => (
                      index < 3 && (
                        <Image key={index} source={{ uri: like.url }} style={{ height: 20, width: 20, borderRadius: 10, marginLeft: -10, marginTop: -10 }} />
                      )
                    ))}
                    {post.likes_count > 0 && (
                      <Text style={{ marginLeft: 5, color: 'black' }}>+{post.likes_count - 0} more likes</Text>
                    )}
                  </View>
							</TouchableOpacity>
							</React.Fragment>
            ))
          ) : (
            <View style={styles.noData}>
              <Text style={{fontSize: 30}}>No data avalable</Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  marginTop:30,
                  borderRadius: 20,
                  borderWidth: 2,
                  height: 50,
                  width: 200,
                  backgroundColor: "#66d4f2",
                  justifyContent: 'center',
                  borderColor: '#98dbed'
                }}
                onPress={() => navigation.navigate('Blog')}
              >
                <Text style={{color: 'white'}}>Create your own post</Text>
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
  );
};

const styles = StyleSheet.create({
  noData:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "50%"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon:{
  	marginLeft: 10,
  },
  wraper: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth:2,
    borderColor: "#fff",
    marginRight: "5%",
    marginTop: "4%",
    marginLeft: "5%",
    width: "85%",
    backgroundColor: "#e1e2e3"
  },
  link: {
    color: 'blue',
  },
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 300, // Adjust the height
    borderRadius: 8,
    marginBottom: 8,
  },
  gridTextContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  gridText: {
    fontSize: 14,
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
	horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 10,
    marginBottom: -3
  },
});

export default HomeScreen;
