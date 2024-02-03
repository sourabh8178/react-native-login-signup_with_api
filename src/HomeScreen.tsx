import React, { useContext, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity,TouchableWithoutFeedback, ScrollView, FlatList, Image, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from './AuthContext';
import { BASE_URL } from './Config';
import axios from 'axios';
import Blog from './Blog';
import UserProfile from "./UserProfile"
import { useNavigation } from '@react-navigation/native';
import BlogView from './BlogView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faCamera,faHeart, faComment, faShare, faBookmark } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = (props) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const [data, setData] = useState(undefined);
  const navigation = useNavigation();
  const [viewType, setViewType] = useState('list');
  const [body, setBody] = useState(null);

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/blogs`, { headers });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Blog')}>
      	<View style={styles.inputPost}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
              <FontAwesomeIcon icon={faCamera} size={20} color="black" style={{ marginRight: "5%" }} />
              <Text style={{ fontSize: 20 }}>Write a post</Text>
            </View>
        </View>
      </TouchableWithoutFeedback>
			<View style={styles.horizontalLine} />
      {viewType === 'list' ? (
        <>
          {data ? (
            data.data.map((post) => (
            	<React.Fragment key={post.id}>
            	<TouchableOpacity
							  style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 15, borderTopColor: '#ccc', borderTopWidth: 5, marginTop: 15 }}
							  onPress={() => handleProfileView(post.profile.id)}
							>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
							    <Image source={{ uri: post.profile.image.url }} style={{ height: '200%', width: "12%", borderRadius: 50, marginRight: 10, marginBottom: 5, marginTop: 15 }} />
							    <Text style={{color: 'black'}}>{post.profile.name.charAt(0).toUpperCase() + post.profile.name.slice(1)}</Text>
							    <FontAwesomeIcon icon={faEllipsisV} style={{ marginLeft: 'auto' }} />
							  </View>
							</TouchableOpacity>
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
          data={data ? data.blogs : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGridItem}
          numColumns={2}
        />
      )}
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        {userInfo ? (
          <>
            <Button title="Logout" color="red" onPress={handleLogout} />
            <TouchableOpacity onPress={() => props.navigation.navigate(Blog)}>
              <Text style={{ color: 'blue' }}>Create blog</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.welcome}>Welcome</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    height: 200,
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
   height: "3%",
   backgroundColor: "#d1cbcb"
  },
	horizontalLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginVertical: 10, // Adjust the margin as needed
  },
});

export default HomeScreen;
