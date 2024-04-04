import React, {useState, useContext, useEffect }from 'react'
import { View, Text, Image, StyleSheet, Button,SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { AuthContext } from "../Auth/AuthContext"
import { BASE_URL } from "../Auth/Config";
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';

const EditMyProfile = () => {
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
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
  const [isDirty, setIsDirty] = useState(false);


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
      setDefaultInputValues(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const setDefaultInputValues = (data) => {
    setEditedData(data); // Set editedData state with profile details
  };
 
  
  const handleEditProfile = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.put(`${BASE_URL}/update_profile`, editedData, { headers });
      setIsDirty(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
    setIsDirty(true);
  };

   const isSaveDisabled = () => {
    return !isDirty || !profileDetail;
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
    setEditedData({ ...editedData, gender });
    setIsDirty(true);
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
          <Text style={styles.changeProfileText} >Change profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputcontainer}>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Personal Informaition</Text>
          <Text style={styles.inputHeader}>Full name</Text>
          <TextInput
            value={editedData?.name}
            style={[styles.input]}
            placeholder="Name"
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <Text style={styles.inputHeader}>User Name</Text>
          <TextInput
            value={editedData?.user_name}
            style={[styles.input]}
            placeholder="User name"
            onChangeText={(text) => handleInputChange('user_name', text)}
          />
          <Text style={styles.inputHeader}>Date Birth</Text>
          <TextInput
            value={editedData?.date_birth}
            style={[styles.inputdb]}
            placeholder=""
            editable={false}
          />
          <Text>Select Gender:</Text>
          <Picker
            selectedValue={editedData?.gender}
            onValueChange={(itemValue, itemIndex) => handleGenderChange(itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        <View style={styles.inputs}>
          <Text style={styles.inputHeader}>About</Text>
          <TextInput
            value={editedData?.about}
            style={[styles.input, styles.multilineInput]}
            placeholder=" About"
            onChangeText={(text) => handleInputChange('about', text)}
          />
        </View>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Billing Informaition</Text>
          <Text style={styles.inputHeader}>Country</Text>
          <TextInput
            value={editedData?.country}
            style={[styles.input]}
            placeholder="Country"
            onChangeText={(text) => handleInputChange('country', text)}
          />
          <Text style={styles.inputHeader}>City</Text>
          <TextInput
            value={editedData?.city}
            style={[styles.input]}
            placeholder="City"
            onChangeText={(text) => handleInputChange('city', text)}
          />
          <Text style={styles.inputHeader}>Postal/Zip Code</Text>
          <TextInput
            value={editedData?.zip_code}
            style={[styles.input]}
            placeholder="Zip Code"
            onChangeText={(text) => handleInputChange('zipcode', text)}
          />
          <Text style={styles.inputHeader}>Address Line</Text>
          <TextInput
            value={editedData?.address}
            style={[styles.input]}
            placeholder="Address Line"
            onChangeText={(text) => handleInputChange('address', text)}
          />
        </View>
        <View style={styles.inputs}>
          <Text style={{ fontSize: 20,  paddingTop: 12, color: 'black', fontWeight: 'bold' }}>Profile Socials</Text>
          <TextInput
            value={editedData?.instagram_url}
            style={[styles.input]}
            placeholder="@instagram Url"
            onChangeText={(text) => handleInputChange('instagram_url', text)}
          />
          <TextInput
            value={editedData?.youtub_url}
            style={[styles.input]}
            placeholder="@Youtub Url"
            onChangeText={(text) => handleInputChange('youtub_url', text)}
          />
          {/*<TextInput
            value={profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}
            style={[styles.input]}
            placeholder="@Facebook url"
            onChangeText={(text) => setTitle(text)}
          />*/}
          <TextInput
            value={editedData?.linkedin_url}
            style={[styles.input]}
            placeholder="@linkedin Url"
            onChangeText={(text) => handleInputChange('linkedin_url', text)}
          />
        </View>
      </View>
      <TouchableOpacity onPress={handleEditProfile} style={[styles.saveButton, isSaveDisabled() && styles.saveButtonDisabled]}>
        <Text style={{color: "#fff", fontSize: 20, fontWeight: 'bold'}}>Save Change</Text>
      </TouchableOpacity>

    </ScrollView>
  )
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 2,
    backgroundColor: '#f0f0f0',
  },
  inputcontainer: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'center',
  },
  changeProfileText: {
    textAlign: 'center',
    marginTop: 5,
    color: 'blue',
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
  inputdb: {
    height: 40,
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#d5dee0',
    paddingLeft: 20,
    color: 'grey',
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
  saveButton: {
    // backgroundColor: '#007bff', // Primary color
    // borderRadius: 5,
    // paddingVertical: 12,
    // paddingHorizontal: 20,
    // marginTop: 20,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147a99',
    height: 40,
    borderRadius: 20,
    marginTop:20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc', // Light gray color
  },
});
export default EditMyProfile;