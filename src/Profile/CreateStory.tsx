import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import axios from 'axios';
import HomeScreen from './HomeScreen';
import { useNavigation, CommonActions } from '@react-navigation/native';

const CreateStory = ({ refreshStory }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const { userInfo } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleChoosePhotoFromLibrary = () => {
        const options = {
		    title: 'Video Picker', 
		    mediaType: 'image/video', 
		    storageOptions:{
		      skipBackup:true,
		      path:'images'
		    }
		};
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImage(response);
            }
        });
    };

    const handleTakePhoto = () => {
        const options = {
            mediaType: 'photo/video',
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                setImage(response);
            }
        });
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleSend = () => {
        navigation.goBack();
        refreshStory();
    };

    const handleCreateStory = () => {
        if (!title && !image) {
			    Alert.alert('Please enter title or select image.');
			    return;
				}

				const formData = new FormData();
        formData.append('title', title);
        if (image) {
				  formData.append('story_image', {
				    uri: image.assets[0].uri,
				    type: image.assets[0].type,
				    name: image.assets[0].fileName,
				  });
				}

			try {
			  axios.post(`${BASE_URL}/stories`, formData, {
			    headers: {
			      Authorization: `Bearer ${userInfo.data.authentication_token}`,
			      'Content-Type': 'multipart/form-data',
			    },
			  })
		    .then((res) => {
		      console.log(res.data);
		      handleSend();
		    })
		    .catch((error) => {
		      const errorMessage = error.response.data.errors;
		      alert(errorMessage);
		      setIsLoading(false);
		    });
			  } catch (errors) {
		      Alert.alert('Error', 'Failed to create story. Please try again later.');
			  }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.inputContainer}>
                {image && (
                    <Image source={{ uri: image.assets[0].uri }} style={styles.image} />
                )}
                <TextInput
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    placeholder="Enter Title"
                    style={styles.input}
                />
                {image ? (
                    <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                        <Text style={styles.buttonText}>Remove Image</Text>
                    </TouchableOpacity>
                ) : (
	                <View style={styles.buttonContainer}>
	                    <TouchableOpacity onPress={handleChoosePhotoFromLibrary} style={styles.button}>
	                        <Text style={styles.buttonText}>Choose from Galery</Text>
	                    </TouchableOpacity>
	                    <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
	                        <Text style={styles.buttonText}>Take Photo</Text>
	                    </TouchableOpacity>
	                </View>
                )}
                <TouchableOpacity onPress={handleCreateStory} style={styles.createButton}>
                    <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: '48%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#27ae60',
        padding: 15,
        borderRadius: 5,
        width: '100%',
    },
    createButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    removeButton: {
    	backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      width: '48%',
      marginBottom: 15
    }
});

export default CreateStory;
