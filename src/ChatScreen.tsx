import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import { GiftedChat, Composer, InputToolbar, Send, Bubble, Avatar } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { AuthContext } from './Auth/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Video from 'react-native-video';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import  storage  from '@react-native-firebase/storage';

const ChatScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const [messageList, setMessageList] = useState([]);
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const chatId = [userInfo.data.id, route.params.userId].sort().join('_');

  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const allmessages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setMessageList(allmessages);
      });
    return () => subscriber();
  }, [userInfo.data.id, route.params.userId]);

  const onSend = useCallback(async (messages = []) => {
    let myMsg = null;
    const msg = messages[0];
    if (imageUrl !== '') {
      myMsg = {
        ...msg,
        sendBy: userInfo.data.id,
        sendTo: route.params.userId,
        image: imageUrl,
        createdAt: Date.parse(msg.createdAt),
        sent: true,
      };
    } 
    else {
      myMsg = {
        ...msg,
        sendBy: userInfo.data.id,
        sendTo: route.params.userId,
        createdAt: Date.parse(msg.createdAt),
        sent: true,
       };
     }
    setImage('');
    checkRoom(userInfo.data.id, route.params.userId, msg);
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(myMsg);
  }, [userInfo.data.id, route.params.userId]);

  const checkRoom = (userId, senderId, msg) => {
    const data = {
      sendTo: senderId,
      message: msg,
    }
    try {
      axios.post(`${BASE_URL}/room`, data, {
        headers: {
          Authorization: `Bearer ${userInfo.data.authentication_token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
      } catch (errors) {
        Alert.alert('Error', 'Failed to create story. Please try again later.');
      }

  }

  const customtInputToolbar = props => {
    return (
       <InputToolbar
        {...props}
        containerStyle={styles.inputtoolbar}
        primaryStyle={styles.primary}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="gray"
          multiline
          {...props.textInputProps}
        />
        {props.children}
      </InputToolbar>
    );
  };

  const handleProfileView = (profileId) => {
    navigation.navigate("UserProfile", {
      id: profileId,
    });
  };

  const CustomMenuItem = ({ icon, text, onSelect }) => {
    return (
      <MenuOption onSelect={onSelect}>
        <View style={styles.menuItem}>
          <Icon name={icon} size={24} color="black" style={{ marginRight: "5%"}}/>
          <Text style={styles.menuItemText}>{text}</Text>
        </View>
      </MenuOption>
    );
  };

  const pickPhoto = async () => {
    try {
      const options = {
        title: 'Take Photo',
        mediaType: 'photo',
        includeBase64: false,
      };
      const images = await launchCamera(options);

      if (!image.didCancel) {
        setImage(images);
        console.warn(images)
        uplaodImage(images);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uplaodImage = async (imageData) => {
    try {
      const fileName = imageData.assets[0].fileName;
      const reference = storage().ref(`images/${fileName}`);
      const pathToFile = imageData.assets[0].uri;
      await reference.putFile(pathToFile);
      const url = await reference.getDownloadURL();
      console.log('Image uploaded successfully. Download URL:', url);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const options = {
        title: 'Select Image',
        type: 'library',
        options: {
          selectionLimit: 1,
          mediaType: 'photo',
          includeBase64: false,
        },
      }
      const images = await launchImageLibrary(options);
      if (!images.didCancel) {
        setImage(images);
        uplaodImage(images);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderSend = props => {
    const hasText = props.text && props.text.trim().length > 0;
    const hasImage = image !== '';

    return (
      <View style={styles.sendContainer}>
        {hasImage && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: image.assets[0].uri }}
              style={styles.imagePreview}
            />
            <TouchableOpacity
              onPress={() => {
                setImage('');
              }}
            >
              <Icon name="times" size={24} color="black" style={styles.inputIcon}/>
            </TouchableOpacity>
          </View>
        )}
        {!hasText && !hasImage && (
          <TouchableOpacity onPress={() => alert('mic clicked')}>
            <Icon name="microphone" size={24} color="black" style={styles.inputIcon}/>
          </TouchableOpacity>
        )}
        {!hasText && !hasImage && (
          <Menu>
            <MenuTrigger>
              <Icon name="folder-open" size={24} color="black" style={styles.inputIcon}/>
            </MenuTrigger>
            <MenuOptions>
              <CustomMenuItem icon={"camera-retro"} text="Take Photo" onSelect={pickPhoto} />
              <CustomMenuItem icon={"image"} text="Send File" onSelect={pickImage} />
            </MenuOptions>
          </Menu>
        )}
        <Send {...props}>
          <View>
            <Icon name="send" size={28} color="#3498db"/>
          </View>
        </Send>
      </View>
    );
  };

  const renderBubble = props => {
    return (
      <View style={{marginBottom: 20}}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: 'orange',
            },
            left: {
              backgroundColor: '#ddd',
            },
          }}
          textStyle={{
            right: {
              color: 'white',
              fontFamily: 'monospace',
            },
            left: {
              color: 'black',
              fontFamily: 'monospace',
            }
          }}
        />
      </View>
    );
  };

  const renderMessageImage = (props) => {
    const { currentMessage } = props;
    // console.warn(props.image)
      // if (currentMessage.image) {
        return (
          <Image
            source={{ uri: currentMessage.image }}
            style={{ width: 200, height: 200, borderRadius: 10, marginTop: 0, marginBottom: 0 }}
          />
        );
      // }

      return null;
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
            <Icon name="arrow-left" size={25} color="black" style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfileView(route.params.profileId)} style={styles.headerChat}>
          <Image source={{ uri: route.params.userProfile }} style={styles.profileImage} />
          <Text style={styles.userName}>{route.params.userName.charAt(0).toUpperCase() + route.params.userName.slice(1)}</Text>
          </TouchableOpacity>
          <Menu>
            <MenuTrigger style={{padding: 20}}>
            <Icon name="ellipsis-v" size={30} color="black" style={styles.menuIcon}/>
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsStyles} >
              <MenuOption onSelect={() => console.log('Block user')} text="Block User" />
              <MenuOption onSelect={() => console.log('More Options')} text="More Options" />
            </MenuOptions>
          </Menu>
        </View>
        <ImageBackground
          source={require('./assest/background.jpg')}
          style={styles.backgroundImage}
        >
        <GiftedChat
          messages={messageList}
          onSend={messages => onSend(messages)}
          user={{
            _id: userInfo.data.id,
            avatar: route.params.userProfile,
            image: imageUrl,
            // sent: true
          }}
          renderInputToolbar={props => customtInputToolbar(props)}
          renderSend={renderSend}
          renderBubble={renderBubble}
          alwaysShowSend
          renderMessageImage={(props) => renderMessageImage(props)}
        />
        </ImageBackground>
      </View>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: 50,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    width: 150,
  },
  optionWrapper: {
    marginVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    marginRight: 10,
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  menuIcon: {
    marginLeft: 'auto',
  },
  icon: {
    marginLeft: 'auto',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputtoolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    marginBottom: 5
  },
  primary: {
    flex: 1,
    borderColor: '#ccc',
    minHeight: 40,
    paddingHorizontal: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
     marginHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: 'black',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 8,
  },
  headerChat: {
    flexDirection: 'row',
    marginRight: 'auto',
    alignItems: 'center',
    marginLeft: 20
  },

});

export default ChatScreen;