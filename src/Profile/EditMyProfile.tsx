import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { AuthContext } from "../Auth/AuthContext"
import { BASE_URL } from "../Auth/Config";
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

const EditMyProfile = () => {
	const [name, setName] = useState(null);
	const [userName, setuserName] = useState(null);
	const [about, setAbout] = useState(null);
	const [location, setLocation] = useState(null);
	const [gender, setGender] = useState(null);
	const [country, setCountry] = useState(null);
	const [city, setCity] = useState(null);
	const [address, setAddress] = useState(null);
	const [zipCode, setZipCode] = useState(null);
	const [dateBirth, setDateBirth] = useState(null);
	const [instagramUrl, setInstagramUrl] = useState(null);
	const [youtubUrl, setYoutubUrl] = useState(null);
	const [linkedinUrl, setLinkedinUrl] = useState(null);
  const [profileDetail, setprofileDetail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileBackgroundImage, setProfileBackgroundImage] = useState(null);
  const [editedData, setEditedData] = useState({});
  const {userInfo, updateProfile, isLoading} = useContext(AuthContext);


  useEffect(() => {
    getAPIData();
  }, []);

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
 
  const setDefaultInputValues = (data) => {
    setName(data.name || '');
    setUserName(data.user_name || '');
    setAbout(data.about || '');
    setLocation(data.location || '');
    setGender(data.gender || '');
    setCountry(data.country || '');
    setCity(data.city || '');
    setAddress(data.address || '');
    setZipCode(data.zip_code || '');
    setDateBirth(data.date_birth || '');
    setInstagramUrl(data.instagram_url || '');
    setYoutubUrl(data.youtub_url || '');
    setLinkedinUrl(data.linkedin_url || '');
    // Update other state variables
  };
  const handleEditProfile = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(`${BASE_URL}/update_profile`, editedData, { headers });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  const handleImagePicker = async () => {
    try {
    	const images = await launchImageLibrary(options);
      console.log(images.assets);

      setProfileImage(images);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User canceled the upload", err);
      else
        console.log(err);
    }
  };
  const handleImagePickerBack = async () => {
    try {
    	const images = await launchImageLibrary(options);
      console.log(images.assets);

      setProfileImage(images);
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User canceled the upload", err);
      else
        console.log(err);
    }
  };
  const handleGenderChange = (gender) => {
    setGender(gender);
  };

  if(profileDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<TouchableOpacity onPress={handleImagePickerBack}>
      	<Image source={{ uri: profileImage?.assets[0].uri || profileDetail.data.profile_background_image.url }} style={styles.backgroundImage} />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
     		<TouchableOpacity onPress={handleImagePicker}>
				  <Image source={{ uri: profileImage?.assets[0].uri || profileDetail.data.profile_image.url }} style={styles.profileImage} />
				  <Text>Change profile</Text>
				</TouchableOpacity>
      </View>
      <View style={[styles.inputs, { marginTop: 70 }]}>
      	<Text style={styles.inputHeader}>Full name</Text>
    		<TextInput
          value={profileDetail.data.name}
          style={[styles.input]}
          placeholder="Name"
          onChangeText={(text) => setEditedData({ ...editedData, name: text })}
        />
        <Text style={styles.inputHeader}>User Name</Text>
        <TextInput
          value={profileDetail.data.user_name}
          style={[styles.input]}
          placeholder="User name"
          onChangeText={(text) => setEditedData({ ...editedData, user_name: text })}
        />
        <Text style={styles.inputHeader}>Date Birth</Text>
        <TextInput
          value={profileDetail.data.date_birth}
          style={[styles.input]}
          placeholder=" Date of Barth"
          onChangeText={(text) => setEditedData({ ...editedData, date_birth: text })}
        />
        <Text style={styles.inputHeader}>Gender</Text>
        <TextInput
          value={profileDetail.data.gender}
          style={[styles.input]}
          placeholder="Gender"
          onChangeText={(text) => setEditedData({ ...editedData, gender: text })}
        />
        <Text>Select Gender:</Text>
        <Picker
					  selectedValue={gender}
					  onValueChange={(itemValue, itemIndex) =>
					    setGender(itemValue)
					  }>
					  <Picker.Item label="select gender" value="" />
					  <Picker.Item label="Male" value="male" />
					  <Picker.Item label="Female" value="female" />
					  <Picker.Item label="Other" value="other" />
					</Picker>
	      <Text>Selected Gender: {gender}</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.inputs}>
      <Text style={styles.inputHeader}>About</Text>
        <TextInput
          value={profileDetail.data.about}
          style={[styles.input, styles.multilineInput]}
          placeholder=" About"
          onChangeText={(text) => setEditedData({ ...editedData, about: text })}
        />
      </View>
        <View style={styles.horizontalLine} />
      <View style={styles.inputs}>
      	<Text style={{ fontSize: 20, marginTop: -15, paddingBottom: 12 }}>Billing Informaition</Text>
      	<Text style={styles.inputHeader}>Country</Text>
        <TextInput
          value={profileDetail.data.country}
          style={[styles.input]}
          placeholder="Country"
          onChangeText={(text) => setEditedData({ ...editedData, country: text })}
        />
        <Text style={styles.inputHeader}>City</Text>
        <TextInput
          value={profileDetail.data.city}
          style={[styles.input]}
          placeholder="City"
          onChangeText={(text) => setEditedData({ ...editedData, city: text })}
        />
        <Text style={styles.inputHeader}>Postal/Zip Code</Text>
        <TextInput
          value={profileDetail.data.zip_code}
          style={[styles.input]}
          placeholder="Zip Code"
          onChangeText={(text) => setEditedData({ ...editedData, zipcode: text })}
        />
        <Text style={styles.inputHeader}>Address Line</Text>
        <TextInput
          value={profileDetail.data.address}
          style={[styles.input]}
          placeholder="Address Line"
          onChangeText={(text) => setEditedData({ ...editedData, address: text })}
        />
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.inputs}>
      <Text style={{ fontSize: 20,  paddingBottom: 12 }}>Profile Socials</Text>
        <TextInput
          value={profileDetail.data.instagram_url}
          style={[styles.input]}
          placeholder="@instagram Url"
          onChangeText={(text) => setEditedData({ ...editedData, instagram_url: text })}
        />
        <TextInput
          value={profileDetail.data.youtub_url}
          style={[styles.input]}
          placeholder="@Youtub Url"
          onChangeText={(text) => setEditedData({ ...editedData, youtub_url: text })}
        />
        {/*<TextInput
          value={profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}
          style={[styles.input]}
          placeholder="@Facebook url"
          onChangeText={(text) => setTitle(text)}
        />*/}
        <TextInput
          value={profileDetail.data.linkedin_url}
          style={[styles.input]}
          placeholder="@linkedin Url"
          onChangeText={(text) => setEditedData({ ...editedData, linkedin_url: text })}
        />
      </View>
      <View style={styles.horizontalLine} />
      <Button
        title="Save Change"
        style={styles.buttonSave}
        onPress={() => {updateProfile(userInfo, editedData)}}
      />
    </ScrollView>
	)
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    position: 'relative',
  },
  backProfile: {
    position: 'absolute',
    top: 20,
    left: "65%",
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  backText: {
    color: '#000',
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'left',
    marginTop: -80,
    marginLeft: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  changeProfile: {
    position: 'absolute',
    top: "100%",
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  buttonText: {
    color: 'black',
  },
  inputs: {
  	padding: "5%",
  },
  input: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingLeft: 20
  },
  horizontalLine: {
    borderBottomColor: 'grey',
    borderBottomWidth: 5,
    width: "100%",
    marginVertical: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    borderTopWidth: 0, 
    borderLeftWidth:0, 
    borderRightWidth:0
  },
  inputHeader: {
  	paddingLeft: 10,
  	marginBottom: 10,
  	fontSize: 15,
  },
  buttonSave: {
  	width: '30%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
});
export default EditMyProfile;