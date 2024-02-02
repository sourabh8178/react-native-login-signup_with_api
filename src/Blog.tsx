import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { AuthContext } from './AuthContext';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import HomeScreen from './HomeScreen'
import { BASE_URL } from "./Config";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options ={
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
      console.error('Error fetching data:', error);
    }
  };

   useEffect(() => {
    getAPIData();
  }, []);

  if (profileDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  };

  	// console.log('Request data:', { image });
  const postCreate = (title, body, image, userInfo) => {

  	setIsLoading(true);
  	// console.warn(image.assets[0]);

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
  };

  const handleBlogView = (blogId) => {
  	navigation.navigate('HomeScreen', {
		    id: blogId 
		});
  };

  const pickImage = async () => {
    try {
    	const images = await launchImageLibrary(options);
      // const doc = await DocumentPicker.pick();
      console.log(images.assets);

      // Set the selected image
      setImage(images);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User canceled the upload", err);
      else
        console.log(err);
    }
  };

  return (
  	<ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
        <View style={{ flexDirection: 'row' }}>
	        <View style={styles.userName}>
		        <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
	          <Text style={styles.userName1}>@{profileDetail.data.user_name}</Text>
		        <Text style={styles.share}>Only for Follwer</Text>
		      </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        {/*<Text style={styles.logins}>Create Blog</Text>*/}
          <TextInput
            value={title}
            style={[styles.input, { borderTopWidth: 0, borderLeftWidth:0, borderRightWidth:0 }]}
            placeholder=" Title"
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            value={body}
            style={[styles.input, styles.multilineInput]}
            placeholder="Whats in your mind"
            multiline
            onChangeText={(text) => setBody(text)}
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
          <Text style={styles.imagePickerText}>Add Image</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image.assets[0].uri }} style={styles.selectedImage} />
          )}

          <Button
            title="Create Post"
            style={styles.selectedImage}
            onPress={() => postCreate(title, body, image, userInfo)}
          />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  inputContainer: {
    backgroundColor: '#fff',
    marginTop: "5%",
    paddingHorizontal: 20
  },
  input: {
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 7,
    // padding: 12,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    borderTopWidth: 0, 
    borderLeftWidth:0, 
    borderRightWidth:0
  },
  imagePickerButton: {
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
    width: '30%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
   profileContainer: {
    // marginTop: 40,
    // marginLeft: -20
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: '#fff',
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginRight: 20
  },
  userName: {
  	marginRight: "30%",
  	paddingLeft: 20,

  },
  share: {
  	fontSize: 10,
  },
  // userName: {
  //   fontSize: 12,
  //   color: 'grey',
  //   marginLeft: 5
  // },
});

export default Blog;