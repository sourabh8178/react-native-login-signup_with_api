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


const HomeScreen = (props) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const [data, setData] = useState(undefined);
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
      showMessage({
        message: "FAILED!",
        description: "failed to get",
        type: "danger",
        duration: 9000,
      });
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false); // Stop the refreshing indicator
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

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

  const handleLogout = () => {
    const headers = {
      Authorization: `Bearer ${userInfo.data.authentication_token}`,
    };
    logout(headers);
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
									<Icon name="heart-o" size={20} color="black" style={styles.icon}/>
                  <Icon name="heart" size={20} color="black" style={styles.icon}/>
                  <Icon name="comment" size={20} color="black" style={styles.icon}/>
                  <Icon name="share-alt" size={20} color="black" style={styles.icon}/>
                  <Icon name="bookmark" size={20} color="black" style={{marginLeft: 'auto'}}/>
                  <Icon name="bookmark-o" size={20} color="black" style={{marginLeft: 'auto'}}/>
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
