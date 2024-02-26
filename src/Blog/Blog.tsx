import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { AuthContext } from '../Auth/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import HomeScreen from '../HomeScreen'
import CreateProfile from "../Profile/CreateProfile";
import { BASE_URL } from "../Auth/Config";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import { RNCamera } from 'react-native-camera';

const options = {
  title: 'Select Image',
  type: 'library',
  options: {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  },
}

const Blog = (props) => {
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState(null);
  const [blogInfo, setBlogInfo] = useState({});
  const [profileDetail, setprofileDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setprofileDetail(response.data);
    } catch (error) {
      console.log('Error fetching data:', error.response.data);
    }
  };

   useEffect(() => {
    getAPIData();
  }, []);

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
    	  const formData = new FormData();
    		formData.append('title', title);
        formData.append('body', body);
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
          setBlogInfo(blogInfo);
  	      AsyncStorage.setItem('blogInfo', JSON.stringify(blogInfo));
  	      setIsLoading(false);
          console.log(blogInfo);
          handleBlogView(blogInfo.id);
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
            <View style={styles.userName}>
              <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
              <Text style={styles.userName1}>@{profileDetail.data.user_name}</Text>
              <Text style={styles.share}>Only for Followers</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text>Select Post type:</Text>
            <RNPickerSelect
              value={postType}
              onValueChange={(itemValue, itemIndex) => setPostType(itemValue)}
              items={[
                { label: 'Reels', value: 'Reels' },
                { label: 'Image', value: 'post' },
                { label: 'Other', value: 'other' },
              ]}
            />
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
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImage}
            >
              <Text style={styles.imagePickerText}>Add Image</Text>
            </TouchableOpacity>
            <View>
              {image && (
                <View>
                  <Image source={{ uri: image.assets[0].uri }} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                    <Text style={styles.removeImageText}>Remove Image</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={() => {postCreate(title, body, image, userInfo)}} style={styles.loginBtn}>
              <Text style={{color: "#fff", fontSize: 20, fontWeight: 'bold'}}>Create Post</Text>
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
            <Text style={{ color: 'white' }}>Create Profile</Text>
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
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
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
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  removeImageText: {
    color: '#fff',
    fontWeight: 'bold',
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
  userName: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName1: {
    fontSize: 16,
    color: '#555',
  },
  share: {
    fontSize: 12,
    color: '#888',
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
    borderRadius: 20,
    borderWidth: 2,
    height: 50,
    width: 200,
    backgroundColor: "#66d4f2",
    justifyContent: 'center',
    borderColor: '#98dbed',
  },
  loginBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d6ddb',
    height: 40,
    borderRadius: 20,
    marginTop:20,
  },
});


export default Blog;