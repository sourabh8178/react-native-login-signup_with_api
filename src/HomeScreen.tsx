import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Button, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList, Image, TextInput, RefreshControl, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Blog from './Blog/Blog';
import UserProfile from "./Profile/UserProfile";
import { useNavigation } from '@react-navigation/native';
import BlogView from './Blog/BlogView';
import Story from './Profile/Story';
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
import Comments from './home/Comments'
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

const HomeScreen = (props) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const [data, setData] = useState(undefined);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();
  const [viewType, setViewType] = useState('list');
  const [body, setBody] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [clicked, setClicked] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [storyRefresh, setStoryRefresh] = useState(false);


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

  const refreshStory = () => {
    setStoryRefresh(true);
  };

  useEffect(() => {
    getAPIData();
  }, []);

  useEffect(() => {
  }, [likedPosts]);

  const handleLikeToggle = (postId) => {
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

  const deletePost = async (postId) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/delete_blog/${postId}`, { headers });
      getAPIData();
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleCommentIconClick = (postId) => {
    navigation.navigate("Comments", {
      postId: postId,
    });
  };

  const handleVideoClick = (postId) => {
    setClicked(true);
    setCurrentVideoId(postId);
    setTimeout(() => {
      setClicked(false);
    }, 15000);
  };

  const onRefresh = () => {
    getAPIData();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <MenuProvider>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                getAPIData();
                refreshStory();
              }}
            />
          }
        >
        <Story refresh={storyRefresh} />
          {viewType === 'list' ? (
            <>
              {data ? (
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
                  <View style={styles.inputPost}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
                      <Icon name="camera-retro" size={20} color="black" style={{ marginRight: "5%" }} />
                      <Text style={{ fontSize: 20, color: "black" }}>Write a post</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                  null
                )}
              {data ? (
                data.data.map((post) => (
                  <React.Fragment key={post.id}>
                    <View style={{
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingTop: 15,
                        borderTopColor: '#ccc',
                        marginTop: 15,
                      }}>
                      {post.is_current_user_post ? (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Profile')}
                          >
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Image source={{ uri: post.profile.image.url }} style={{ height: '200%', width: "12%", borderRadius: 50, marginRight: 10, marginBottom: 5, marginTop: 15 }} />
                            <Text style={{ color: 'black', fontSize:18, fontWeight: 'bold' }}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
                          </View>
                        </TouchableOpacity>
                        ) : (
                        <TouchableOpacity
                          onPress={() => handleProfileView(post.profile.id)}
                          >
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Image source={{ uri: post.profile.image.url }} style={{ height: '200%', width: "12%", borderRadius: 50, marginRight: 10, marginBottom: 5, marginTop: 15 }} />
                            <Text style={{ color: 'black', fontSize:18, fontWeight: 'bold' }}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      <View style={{marginTop: -28, marginRight: 20}}>
                        {post.is_current_user_post ? (
                          <Menu>
                            <MenuTrigger style={{ marginLeft: '75%' }}>
                              <Icon name="ellipsis-v" size={30} color="black" style={{ marginLeft: 'auto' }} />
                            </MenuTrigger>
                            <MenuOptions customStyles={menuOptionsStyles} >
                              <MenuOption onSelect={() => editPost(post.id)} text="Edit" />
                              <MenuOption onSelect={() => editPost(post.id)} text="share" />
                              <MenuOption onSelect={() => showDeleteConfirmation(post.id)} text="Delete" />
                            </MenuOptions>
                          </Menu>
                          ) : (
                            <Menu>
                              <MenuTrigger style={{ padding: 5, marginLeft: '75%' }}>
                                <Icon name="ellipsis-v" size={30} color="black" style={{ marginLeft: 'auto' }} />
                              </MenuTrigger>
                              <MenuOptions customStyles={menuOptionsStyles} >
                                <MenuOption onSelect={() => editPost(post.id)} text="report" />
                                <MenuOption onSelect={() => editPost(post.id)} text="share" />
                              </MenuOptions>
                            </Menu>
                        )}
                      </View>
                    </View>
                    <View>
                      {post.blog_image.blob === "video/mp4" ? (
                        <View style={styles.blogVideo}>
                            <TouchableOpacity style={{width: "100%", height: 200}} onPress={() => handleVideoClick(post.id)}>
                              {currentVideoId === post.id ? (
                                <Video
                                  paused={paused}
                                  source={{ uri: post.blog_image.url }}
                                  style={styles.video}
                                  muted={muted}
                                />
                              ) : (
                              <Image source={require("./assest/videothumb.jpeg")} style={styles.blogImage} />
                              )}
                            </TouchableOpacity>
                            {clicked && currentVideoId === post.id && (
                              <View style={{
                                width: "100%",
                                height: "100%",
                                positions: "absolute",
                                backgroundColor: 'rbga(0,0,0,0.5)',
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "-50%"
                              }}>
                                <View style={{flexDirection: 'row'}}>
                                  <TouchableOpacity onPress={() => setPaused(!paused)} style={styles.touchArea}>
                                    <View style={styles.touchAreaContainer}>
                                      <Icon name={paused ? 'play' : 'pause'} size={30} color="white" />
                                    </View>
                                  </TouchableOpacity>
                                </View>
                                  <TouchableOpacity onPress={() => setMuted(!muted)} style={[styles.touchArea, { marginLeft: "80%" }]}>
                                    <View style={styles.touchAreaContainer}>
                                      <Icon name={muted ? 'volume-off' : 'volume-up'} size={30} color="white" />
                                    </View>
                                  </TouchableOpacity>
                              </View>
                              )}
                        </View>
                      ) : (
                        <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
                      )}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => handleLikeToggle(post.id)}>
                          <Icon
                            name={post.liked ? 'heart' : 'heart-o'}
                            size={25}
                            color={post.liked ? 'red' : 'black'}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCommentIconClick(post.id)}>
                          <Icon name="comment-o" size={25} color="black" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBookmarkToggle(post.id)} style={{ marginLeft: '65%' }}>
                          <Icon
                            name={post.bookmarked ? 'bookmark' : 'bookmark-o'}
                            size={25}
                            color={post.bookmarked ? 'black' : 'black'}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginLeft: 1, marginLeft: 20 }}>
                        {post.likes.map((like, index) => (
                          index < 3 && (
                            <Image key={index} source={{ uri: like.url }} style={{ height: 20, width: 20, borderRadius: 10, marginLeft: -10, marginTop: -10 }} />
                          )
                        ))}
                        {post.likes_count > 0 && (
                          <Text style={{ marginLeft: 5, color: 'black' }}>+{post.likes_count - 0} more likes</Text>
                        )}
                      </View>
                      <Text style={{ color: 'black', margin: 10, padding: 10 }}>{post.body}</Text>
                    </View>
                  </React.Fragment>
                ))
              ) : (
                  <View style={styles.noData}>
                    <Text style={{ fontSize: 30 }}>No data avalable</Text>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        marginTop: 30,
                        borderRadius: 20,
                        height: 50,
                        width: 200,
                        backgroundColor: "#147a99",
                        justifyContent: 'center',
                        borderColor: '#98dbed',
                        elevation: 10,
                      }}
                      onPress={() => navigation.navigate('Blog')}
                      >
                      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Create your own post</Text>
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
    </KeyboardAvoidingView>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: -10,
    marginLeft: '60%',
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 8,
    width: 5,
  },
  optionWrapper: {
    marginVertical: 5,
  },
  optionText: {
    fontSize: 20,
    color: 'black',
  },
};

const styles = StyleSheet.create({
  noData: {
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

  icon: {
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
    borderWidth: 2,
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
    height: 300,
    borderRadius: 8,
    marginBottom: 8,
  },
  blogVideo: {
    width: '100%',
    height: 300,
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
    backgroundColor: 'white',
    elevation: 10,
    marginTop: 20,
    marginLeft: "5%",
    marginRight: "5%",
    borderRadius: 20,
    height: 50,
    justifyContent: 'center'
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 5,
    marginLeft: '3%',
    width: '94%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  playPauseButton: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  touchArea: {
    padding: 20,
  },
  touchAreaContainer: {
    padding: 10,
  },
});

export default HomeScreen;
