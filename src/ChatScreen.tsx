import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { GiftedChat, Composer, InputToolbar, Send, Bubble, Avatar } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faArrowLeft, faCamera, faFile, faPaperPlane, faSmile, faMicrophone, faCog, faImages  } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

const ChatScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const [messageList, setMessageList] = useState([]);
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
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: userInfo.data.id,
      sendTo: route.params.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(myMsg);
  }, [userInfo.data.id, route.params.userId]);

  const handleSendFile = async () => {}

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

  const CustomMenuItem = ({ icon, text, onSelect }) => {
    return (
      <MenuOption onSelect={onSelect}>
        <View style={styles.menuItem}>
          <FontAwesomeIcon icon={icon} size={24} color="gray" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>{text}</Text>
        </View>
      </MenuOption>
    );
  };

  const renderSend = props => {
    return (
      <View style={styles.sendContainer} >
      <TouchableOpacity onPress={()=> alert('mic clicked')}>
        <FontAwesomeIcon icon={faMicrophone} size={24} color="gray" style={styles.inputIcon} />
      </TouchableOpacity>
      <Menu>
        <MenuTrigger>
          <FontAwesomeIcon icon={faImages} size={24} color="gray" style={styles.inputIcon} />
        </MenuTrigger>
        <MenuOptions >
          <CustomMenuItem icon={faCamera} text="Take Photo" onSelect={() => console.log('Take Photo')} />
          <CustomMenuItem icon={faFile} text="Send File" onSelect={() => console.log('Send File')} />
        </MenuOptions>
      </Menu>
      <Send {...props}>
        <View>
          <FontAwesomeIcon icon={faPaperPlane} size={30} color="#3498db" />
        </View>
      </Send>
      </View>
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
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
    );
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Message')}>
            <FontAwesomeIcon icon={faArrowLeft} size={25} color="black" style={styles.icon} />
          </TouchableOpacity>
          <Image source={{ uri: route.params.userProfile }} style={styles.profileImage} />
          <Text style={styles.userName}>{route.params.userName.charAt(0).toUpperCase() + route.params.userName.slice(1)}</Text>
          <Menu>
            <MenuTrigger>
              <FontAwesomeIcon icon={faEllipsisV} size={25} color="black" style={styles.icon} />
            </MenuTrigger>
            <MenuOptions customStyles={menuOptionsStyles} >
              <MenuOption onSelect={() => console.log('Block user')} text="Block User" />
              <MenuOption onSelect={() => console.log('More Options')} text="More Options" />
            </MenuOptions>
          </Menu>
        </View>
        <GiftedChat
          messages={messageList}
          onSend={messages => onSend(messages)}
          user={{
            _id: userInfo.data.id,
            avatar: route.params.userProfile,
          }}
          renderInputToolbar={props => customtInputToolbar(props)}
          renderSend={renderSend}
          renderBubble={renderBubble}
          alwaysShowSend
        />
      </View>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: 30,
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
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
  icon: {
    marginLeft: 'auto',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  inputtoolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  primary: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
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
});

export default ChatScreen;