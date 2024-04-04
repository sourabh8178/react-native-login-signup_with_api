import React, { useState, useContext } from 'react';
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { AuthContext } from "../Auth/AuthContext"
import { BASE_URL } from "../Auth/Config";
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateProfile = () => {

	const [date, setDate] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [about, setAbout] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
	const {userInfo} = useContext(AuthContext);
	const navigation = useNavigation();

	const validateInputs = () => {
    if (!profileImage) {
	    Alert.alert('Please select a profile image.');
	    return false;
	  }

	  if (!backgroundImage) {
	    Alert.alert('Please select a background image.');
	    return false;
	  }

	  if (!name) {
	    Alert.alert('Please enter your full name.');
	    return false;
	  }

	  if (!userName) {
	    Alert.alert('Please enter your user name.');
	    return false;
	  }

	  if (!gender) {
	    Alert.alert('Please select your gender.');
	    return false;
	  }

    if (!date) {
      Alert.alert('Please select your date of birth.');
      return false;
    }

    return true;
  };
  const handleCreateProfile = () => {
    if (!validateInputs()) return;
		const formData = new FormData();
		formData.append('name', name);
    formData.append('user_name', userName);
    formData.append('date_birth', date ? date.toLocaleDateString() : '');
    formData.append('gender', gender);
    formData.append('about', about);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('zip_code', zipCode);
    formData.append('address', address);
    formData.append('instagram_url', instagramUrl);
    formData.append('youtub_url', youtubeUrl);
    formData.append('linkedin_url', linkedinUrl);
    if (profileImage && profileImage.assets && profileImage.assets.length > 0) {
		  formData.append('profile_image', {
		    uri: profileImage.assets[0].uri,
		    type: profileImage.assets[0].type,
		    name: profileImage.assets[0].fileName,
		  });
		}
    if (backgroundImage && backgroundImage.assets && backgroundImage.assets.length > 0) {
		  formData.append('profile_background_image', {
		    uri: backgroundImage.assets[0].uri,
		    type: backgroundImage.assets[0].type,
		    name: backgroundImage.assets[0].fileName,
		  });
		}

	  try {
	  axios.post(`${BASE_URL}/profile`, formData, {
	    headers: {
	      Authorization: `Bearer ${userInfo.data.authentication_token}`,
	      'Content-Type': 'multipart/form-data',
	    },
	  })
    .then((res) => {
      console.log(res.data);
      Alert.alert('Success', 'Profile created successfully.');
      handleProfileView()
    })
    .catch((error) => {
      // console.log('iiiii', error.response.data.errors);
      const errorMessage = error.response.data.errors;
      alert(errorMessage);
      setIsLoading(false);
    });
	  } catch (errors) {
	    console.log('Profile creation failed:',errors);
      Alert.alert('Error', 'Failed to create profile. Please try again later.');
	  }
	};

	const handleProfileView = () => {
  	navigation.navigate('Profile');
  };

  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };
      const images = await launchImageLibrary(options);
      if (!images.didCancel) {
        setProfileImage(images);
      }
    } catch (err) {
      console.error('Image picking failed:', err);
      Alert.alert('Error', 'Failed to pick image. Please try again later.');
    }
  };
  const backPickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };
      const images = await launchImageLibrary(options);
      if (!images.didCancel) {
        setBackgroundImage(images);
      }
    } catch (err) {
      console.error('Background image picking failed:', err);
      Alert.alert('Error', 'Failed to pick background image. Please try again later.');
    }
  };
  const removeImage = () => {
    setProfileImage('');
  };
  const removeBackgroundImage = () => {
    setBackgroundImage('');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 2, paddingBottom: 5 }}>
	    <View style={styles.imageContainer}>
	     {backgroundImage && <Image source={{ uri: backgroundImage.assets[0].uri }} style={styles.backgroundImage} />}
        {backgroundImage ? (
          <TouchableOpacity style={styles.removeImageButton} onPress={removeBackgroundImage}>
            <Text style={{color: 'white'}}>Remove Image</Text>
          </TouchableOpacity>
          ) : (
          <TouchableOpacity style={styles.imageBackPickerButton} onPress={backPickImage} >
            <Text style={{color: 'white', fontWeight: 'bold'}}>Add back Image</Text>
          </TouchableOpacity>
        )}
	    </View>
	    <View style={{marginLeft: 10}}>
		    {profileImage && <Image source={{ uri: profileImage.assets[0].uri }} style={styles.profileImage} /> }
        {profileImage ? (
          <TouchableOpacity style={styles.removeProfileImageButton} onPress={removeImage}>
            <Text style={{color: 'white'}}>Remove Image</Text>
          </TouchableOpacity>
          ) : (
  	      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} >
  	      	<Text style={{color: 'white', fontWeight: 'bold'}}>Add profile Image</Text>
  	      </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputcontainer}>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Personal Informaition</Text>
          <Text style={styles.inputHeader}>Full name*</Text>
          <TextInput
            value={name}
            style={[styles.input]}
            placeholder="Name"
            onChangeText={(text) => setName(text)}
          />
          <Text style={styles.inputHeader}>User Name*</Text>
          <TextInput
            value={userName}
            style={[styles.input]}
            placeholder="User name"
            onChangeText={(text) => setUserName(text)}
          />
          <Text style={styles.inputHeader}>Date Birth*(Date of Birth will no Change)</Text>
	        <TouchableOpacity style={{ backgroundColor: '#32adcf', padding: 6, borderRadius: 5, alignItems: 'center', marginTop: 0, marginBottom: 10, width: '40%', marginRight: 'auto' }}
	          onPress={showDatepicker}
  	        >
  	        {date ? (
  				    <Text style={{color: 'white', fontWeight: 'bold'}}> {date.toLocaleDateString()}</Text>
  	        	) : (
  	        		<Text style={{color: 'white', fontWeight: 'bold'}}>--/--/--</Text>
  	        )}
  			   	<SafeAreaView>
  			      {show && (
  			        <DateTimePicker
  			          // testID="dateTimePicker"
  			          value={dateOfBirth}
  			          mode={mode}
  			          is24Hour={true}
  			          onChange={onChange}
  			        />
  			      )}
  			    </SafeAreaView>
          </TouchableOpacity>
          
          <Text style={styles.inputHeader}>Select Gender*</Text>
          <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) =>
                setGender(itemValue)
              }>
              <Picker.Item label="select gender:" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
        </View>
        <View style={styles.inputs}>
        <Text style={styles.inputHeader}>About*</Text>
          <TextInput
            value={about}
            style={[styles.input, styles.multilineInput]}
            placeholder=" About"
            onChangeText={(text) => setAbout(text)}
          />
        </View>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Billing Informaition</Text>
          <Text style={styles.inputHeader}>Country</Text>
          <TextInput
            value={country}
            style={[styles.input]}
            placeholder="Country"
            onChangeText={(text) => setCountry(text)}
          />
          <Text style={styles.inputHeader}>City</Text>
          <TextInput
            value={city}
            style={[styles.input]}
            placeholder="City"
            onChangeText={(text) => setCity(text)}
          />
          <Text style={styles.inputHeader}>Postal/Zip Code</Text>
          <TextInput
            value={zipCode}
            style={[styles.input]}
            placeholder="Zip Code"
            onChangeText={(text) => setZipCode(text)}
          />
          <Text style={styles.inputHeader}>Address Line</Text>
          <TextInput
            value={address}
            style={[styles.input]}
            placeholder="Address Line"
            onChangeText={(text) => setAddress(text)}
          />
        </View>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Profile Socials</Text>
          <TextInput
            value={instagramUrl}
            style={[styles.input]}
            placeholder="@instagram Url"
            onChangeText={(text) => setInstagramUrl(text)}
          />
          <TextInput
            value={youtubeUrl}
            style={[styles.input]}
            placeholder="@Youtub Url"
            onChangeText={(text) => setYoutubeUrl(text)}
          />
          <TextInput
            value={linkedinUrl}
            style={[styles.input]}
            placeholder="@linkedin Url"
            onChangeText={(text) => setLinkedinUrl(text)}
          />
        </View>
      </View>
        <TouchableOpacity
          style={styles.buttonSave}
          onPress={handleCreateProfile}
        >
          <Text style={{ color: 'white' }}>Create Profile</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  inputcontainer: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    position: 'relative',
    borderColor: 'grey',
   borderWidth: 1
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    // borderColor: '#fff',
    borderColor: 'grey',
  },
  imagePickerButton: {
    alignItems: 'center',
    marginTop:10,
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    width: 150,
    backgroundColor: "#2baed6",
    justifyContent: 'center',
    borderColor: '#2baed6'
  },
  imageBackPickerButton: {
    alignItems: 'center',
    marginTop:10,
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    width: 150,
    backgroundColor: "#2baed6",
    justifyContent: 'center',
    borderColor: '#2baed6',
    marginLeft: 'auto'
  },
  inputs: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#d5dee0',
    paddingLeft: 20,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    borderTopWidth: 0, 
    borderLeftWidth:0, 
    borderRightWidth:0
  },
  inputHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  buttonSave: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147a99',
    height: 40,
    borderRadius: 20,
    marginTop:20,
  },
  selectedImage: {
    width: '30%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  removeImageButton: {
  	marginTop: 10,
    backgroundColor: 'red',
    marginLeft: 'auto',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: "40%",
    marginRight: 10
  },
  removeProfileImageButton: {
    alignItems: 'center',
    justifyContent: 'center',
  	backgroundColor: 'red',
  	borderRadius: 10,
    height: 30,
    width: "30%",
    // paddingTop:2
    marginTop: 10,
  }
});
export default CreateProfile;