import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../Auth/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import HomeScreen from '../HomeScreen'
import CreateProfile from "../Profile/CreateProfile";
import { BASE_URL } from "../Auth/Config";
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { RNCamera } from 'react-native-camera';
import {Picker} from '@react-native-picker/picker';

const options = {
    title: 'Video Picker', 
    mediaType: 'image/video', 
    storageOptions:{
      skipBackup:true,
      path:'images'
    }
};

const Blog = (props) => {
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState(null);
  const [blogInfo, setBlogInfo] = useState({});
  const [profileDetail, setprofileDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

   useEffect(() => {
    getAPIData();
  }, []);

   if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text>Your post is getting ready </Text>
      </View>
    );
  }

  const validateInputs = () => {
    if (!title || !body || !postType || !image) {
      alert('Please fill in all fields and select an image');
      return false;
    }
    return true;
  };

  const postCreate = (title, body, image, userInfo) => {
      if (validateInputs()){
       setIsLoading(true);
       setIsRefreshing(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('postType', postType);
        formData.append('image', {
            uri: image.assets[0].uri,
            type: image.assets[0].type,
            name: image.assets[0].fileName,
        });
      axios.post(`${BASE_URL}/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.data.authentication_token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          let blogInfo = res.data;
          setIsLoading(false);
          // console.log(blogInfo);
          handleBlogView(blogInfo.data.id);
        })
        .catch(e => {
          console.log(`register error ${e}`);
          setIsLoading(false);
      });
    }
  };

  const handleBlogView = (blogId) => {
    navigation.navigate('BlogView', {
        id: blogId 
    });
  };

  const removeImage = () => {
    setImage('');
  };

  const pickImage = async () => {
    try {
      const images = await launchImageLibrary(options);

      if (!images.didCancel) {
        setImage(images);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profileDetail ? (
        <>
          <View style={styles.profileContainer}>
            <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>@{profileDetail.data.user_name}</Text>
              <RNPickerSelect
                value={postType}
                onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}
                items={[
                  { label: 'Reels', value: 'reels' },
                  { label: 'Post', value: 'post' },
                  { label: 'story', value: 'story' },
                ]}
                placeholder={{ label: 'Select Post Type', value: null }}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={title}
              style={styles.input}
              placeholder="Title"
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              value={body}
              style={[styles.input, styles.multilineInput]}
              placeholder="What's in your mind"
              multiline
              onChangeText={(text) => setBody(text)}
            />
            
            {image && <Image source={{ uri: image.assets[0].uri }} style={styles.selectedImage} />}
            {image ? (
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Text style={styles.removeImageText}>Remove Image</Text>
                </TouchableOpacity>
              ) : (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <Text style={styles.imagePickerText}>Add Image</Text>
              </TouchableOpacity>
              )}
            <TouchableOpacity onPress={() => {postCreate(title, body, image, userInfo)}} style={styles.createPostButton}>
              <Text style={styles.createPostButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noProfileContainer}>
          <Text style={styles.noProfileText}>Complete your profile details</Text>
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={() => navigation.navigate('CreateProfile')}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    padding: 12,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    width: '100%',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  removeImageButton: {
    width: '100%',
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#555',
  },
  noProfileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noProfileText: {
    fontSize: 18,
    marginBottom: 20,
  },
  createProfileButton: {
    alignItems: 'center',
    marginTop: 30,
    elevation: 10,
    borderRadius: 10,
    height: 50,
    width: 200,
    backgroundColor: "#147a99",
    justifyContent: 'center',
  },
  createPostButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147a99',
    height: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Blog;
