import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, Button, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList, Image, TextInput, RefreshControl, Alert, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Blog from './Blog/Blog';
import UserProfile from "./Profile/UserProfile"
import { useNavigation } from '@react-navigation/native';
import BlogView from './Blog/BlogView';
import Story from './Profile/Story'
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';
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
  const [showModal, setShowModal] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [postIds, setPostIds] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [noCommentData, setNoCommentData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

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
      // Alert.alert('Please Complete your profile.');
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

  const togglePlaying = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Function to toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
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

  const openModel = (postId) => {
    setShowModal(true);
    commentPost(postId);
  }

  const commentPost = async (postId) => {
    const token = userInfo.data.authentication_token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(`${BASE_URL}/comments/${postId}`, { headers });
      setCommentData(response.data);
      setPostIds(postId);
    } catch (error) {
      console.log(error.response.data.errors);
      setNoCommentData(error.response.data.errors);
    }

  };

  const closeModal = () => {
    setCommentData(null);
    setNoCommentData(null);
    setPostIds(null);
    setShowModal(false);
  };

  const handleSubmit = async (postIds) => {
    if (!textInputValue) {
      return false;
    }
    const token = userInfo.data.authentication_token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      post_id: postIds,
      comment: textInputValue,
    };
    try {
      const response = await axios.post(`${BASE_URL}/comment`, data, { headers });
      await commentPost(postIds); // Wait for comment data to be fetched
      setTextInputValue(''); 
    } catch (error) {
      setShowModal(true);
      console.log(error.response.data.errors);
    }
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
              onRefresh={onRefresh}
            />
          }
        >
        <Story/>
          {viewType === 'list' ? (
            <>
              {data ? (
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
                  <View style={styles.inputPost}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
                      <Icon name="camera-retro" size={20} color="black" style={{ marginRight: "5%" }} />
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
                  <View style={{
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        padding: 15,
                        borderTopColor: '#ccc',
                        borderTopWidth: 5,
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
                              <MenuOption onSelect={() => showDeleteConfirmation(post.id)} text="Delete" />
                            </MenuOptions>
                          </Menu>
                          ) : (
                            <Menu>
                              <MenuTrigger style={{ padding: 10, marginLeft: '75%' }}>
                                <Icon name="ellipsis-v" size={30} color="black" style={{ marginLeft: 'auto' }} />
                              </MenuTrigger>
                              <MenuOptions customStyles={menuOptionsStyles} >
                                <MenuOption onSelect={() => editPost(post.id)} text="report" />
                              </MenuOptions>
                            </Menu>
                        )}
                      </View>
                    </View>
                    <View style={{
                      borderBottomLeftRadius: 30,
                      borderBottomRightRadius: 30,
                      padding: 15,
                      borderBottomColor: '#ccc',
                      borderBottomWidth: 5,
                      marginTop: "auto"
                    }}
                    >
                      <TouchableOpacity onPress={() => handleBlogView(post.id)}>
                        <Text style={{ color: 'black' }}> {post.title.charAt(0).toUpperCase() + post.title.slice(1)}</Text>
                        <Text style={{ color: 'black' }}> {post.body}</Text>
                        {post.blog_image.blob === "video/mp4" ? (
                          <View>
                           <Button onPress={togglePlaying} title={isPlaying ? 'Stop' : 'Play'} />
                            <Button
                              onPress={() => setIsMuted(m => !m)}
                              title={isMuted ? 'Unmute' : 'Mute'}
                            />
                          <Video
                            ref={videoRef}
                            source={{ uri: post.blog_image.url }}
                            autoplay={true}
                            paused={!isPlaying}
                            controls={false}
                            muted={isMuted}
                            style={styles.blogImage}
                          />
                          </View>
                        ) : (
                          <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
                        )}
                      </TouchableOpacity>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <TouchableOpacity onPress={() => handleLikeToggle(post.id)}>
                          <Icon
                            name={post.liked ? 'heart' : 'heart-o'}
                            size={20}
                            color={post.liked ? 'red' : 'black'}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModel(post.id)}>
                          <Icon name="comment" size={20} color="black" style={styles.icon} />
                        </TouchableOpacity>
                        <Modal
                            visible={showModal}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={closeModal}
                          >
                          <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                              <Text style={styles.modalTitle}>Comments</Text>
                              <TouchableOpacity onPress={closeModal}>
                                <Icon name="times" size={25} color="black" style={styles.modalIcon} />
                              </TouchableOpacity>
                            </View>
                            <ScrollView>
                              <View style={styles.commentContainer}>
                                {commentData ? (
                                  commentData.data.map((comment, index) => (
                                    <View style={styles.commentItem} key={index}>
                                      {/* User profile picture */}
                                      <Image source={{ uri: comment.profile_image.url }} style={styles.profileImage} />
                                      {/* User name and date */}
                                      <View style={styles.commentHeader}>
                                        <Text style={styles.userName}>
                                          {comment.name}{" "}
                                          <Text style={styles.commentDate}>{" , " + comment.created_at}</Text>
                                        </Text>
                                        <Text style={styles.commentText}>{comment.message}</Text>
                                      </View>
                                    </View>
                                  ))
                                ) : (
                                  <View style={[styles.loadingContainer, { justifyContent: 'center' }]}>
                                    {noCommentData ? (
                                      <Text>No comments....</Text>
                                    ) : (
                                      <Text>Loading....</Text>
                                    )}
                                  </View>
                                )}
                              </View>
                            </ScrollView>
                            {/* Comment input displayed at the bottom */}
                            <View style={styles.inputContainer}>
                              <TextInput
                                value={textInputValue}
                                style={styles.inputComment}
                                placeholder="Add your comment..."
                                onChangeText={(text) => setTextInputValue(text)}
                              />
                              <TouchableOpacity onPress={() => handleSubmit(postIds)} style={styles.createCommentButton}>
                                <Text style={{color: 'white', fontSize: 18}}>Add Comment</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>

                        <Icon name="share-alt" size={20} color="black" style={styles.icon} />
                        <TouchableOpacity onPress={() => handleBookmarkToggle(post.id)} style={{ marginLeft: '65%' }}>
                          <Icon
                            name={post.bookmarked ? 'bookmark' : 'bookmark-o'}
                            size={20}
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
                        borderWidth: 2,
                        height: 50,
                        width: 200,
                        backgroundColor: "#66d4f2",
                        justifyContent: 'center',
                        borderColor: '#98dbed'
                      }}
                      onPress={() => navigation.navigate('Blog')}
                    >
                      <Text style={{ color: 'white' }}>Create your own post</Text>
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
    marginTop: -20,
    marginLeft: '50%',
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
    height: 60,
    backgroundColor: "#d1cbcb"
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginVertical: 5,
    marginLeft: '3%',
    width: '94%',
  },
  createCommentButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#147a99',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 30,
    marginTop: '20%',
    borderRadius: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalIcon: {
    marginLeft: 'auto',
  },
  commentItem: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 30,
    borderRadius: 25,
  },
  commentHeader: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  commentDate: {
    color: '#777',
  },
  commentText: {
    color: '#333',
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  inputComment: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
  },
});

export default HomeScreen;
