import React, {useContext, useState, useEffect, useRef} from 'react'
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, Dimensions, Alert, ActivityIndicator, Share,FlatList
} from 'react-native';
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import Video from 'react-native-video';

const Reels = () => {
	const { userInfo } = useContext(AuthContext);
	const [blogData, setBlogData] = useState(null);
	const navigation = useNavigation();
	const [viewType, setViewType] = useState('list');
	const [loading, setLoading] = useState(true);
	const [paused, setPaused] = useState(true);
	const videoRefs = useRef([]);

	const getAPIBlogData = async () => {
	    try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      const response = await axios.get(`${BASE_URL}/reels`, { headers });
	      const updatedBlogData = response.data.data.map((post) => {
	        return {
	          ...post,
	          video_url: post.blog_image.url,
	          isVideoVisible: false,
	        };
	      });
	      setBlogData(updatedBlogData);
	      setLoading(false);
	    } catch (error) {
	    	setLoading(false);
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

	  const handlePlayPause = () => {
	    setPaused(!paused);
	  };

	  const handleUnmute = (index) => {
	    // Toggle mute/unmute for the video at given index
	    if (videoRefs.current[index]) {
	      const video = videoRefs.current[index];
	      video.present ? video.present.toggleMute() : null;
	    }
	  };

	  const onVideoVisible = (index) => {
    // Update the video visibility flag when it becomes visible
    if (!blogData[index].isVideoVisible) {
      const updatedBlogData = [...blogData];
      updatedBlogData[index].isVideoVisible = true;
      setBlogData(updatedBlogData);
    }
  };

  const renderGridItem = ({ item, index }) => (
    <TouchableOpacity
      style={{
        flex: 1,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
      }}
      onPress={() => handleVideoPress(item.id)}
    >
      <View style={{ position: 'absolute', top: 10, right: 10 }}>
        <TouchableOpacity onPress={() => handleUnmute(index)}>
          <Icon name="volume-up" size={25} color="white" />
        </TouchableOpacity>
      </View>
      {item.isVideoVisible && ( // Render video only if it's visible
        <Video
          source={{ uri: item.video_url }}
          ref={(ref) => (videoRefs.current[index] = ref)}
          style={styles.blogImage}
          muted={true}
          repeat={true}
          resizeMode="cover"
          onBuffer={() => {}}
          onLoad={() => {}}
          onProgress={() => {}}
        />
      )}
    </TouchableOpacity>
  );



	return (
		<ScrollView>
        {viewType === 'list' ? (
          <>
            {blogData ? (
              blogData.map((post) => (
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
                    <TouchableOpacity onPress={handlePlayPause}>
	                    <Video
	                      source={{ uri: post.video_url }}
	                      style={styles.blogImage}
	                      paused={paused} // Pass the paused state to control playback
	                    />
	                  </TouchableOpacity>
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
		      data={blogData}
		      keyExtractor={(item) => item.id.toString()}
		      renderItem={renderGridItem}
		      numColumns={2}
		      onViewableItemsChanged={({ viewableItems }) => {
		        // Detect when video becomes visible
		        viewableItems.forEach(({ item, index }) => {
		          if (item.isVideoVisible !== true) {
		            onVideoVisible(index);
		          }
		        });
		      }}
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

export default Reels;