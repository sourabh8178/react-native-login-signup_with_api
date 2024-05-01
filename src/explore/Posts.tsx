import React, {useContext, useState, useEffect} from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, Dimensions, Alert, ActivityIndicator, Share,FlatList
} from 'react-native';
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';

const Posts = () => {
	const { userInfo } = useContext(AuthContext);
	const [blogData, setBlogData] = useState(null);
	const navigation = useNavigation();
	const [viewType, setViewType] = useState('list');
	const [likedPosts, setLikedPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const getAPIBlogData = async () => {
	    try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      const response = await axios.get(`${BASE_URL}/posts`, { headers });
	      setBlogData(response.data);
	      setLoading(false);
	    } catch (error) {
	    	setLoading(false);
	      // console.error('Error fetching data:', error);
	    }
	  };

	  useEffect(() => {
	    getAPIBlogData();
	  }, []);

	  if (loading) {
	    return (
	      <View style={styles.loadingContainer}>
	        <ActivityIndicator size="large" color="#2baed6" />
	      </View>
	    );
	  }

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

	  const handleLike = async (postId) => {
	    try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      await axios.post(`${BASE_URL}/like/${postId}`, {}, { headers });
	      setLikedPosts([...likedPosts, postId]);
	      getAPIBlogData();
	    } catch (error) {
	      console.log(error.response.data.errors);
	    }
	  };

	  const handleUnlike = async (postId) => {
	    try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      await axios.post(`${BASE_URL}/unlike/${postId}`, {}, { headers });
	      getAPIBlogData();
	    } catch (error) {
	      console.log(error.response.data.errors);
	    }
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
	  };

	return (
		<ScrollView>
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
                      backgroundColor: 'white',
                      elevation: 10,
                      marginTop: "auto",
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
                      backgroundColor: 'white',
                      elevation: 10,
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
	)
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 5,
    width: 120,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    elevation: 5,
    position: 'relative',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statText: {
    fontSize: 18,
    marginLeft: 10,
  },
  name: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'white',
  },
  socialLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  blogImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  createProfileButton: {
    backgroundColor: '#2baed6',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Posts