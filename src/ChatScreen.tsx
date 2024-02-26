import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, Composer } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from './Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

  const handleTyping = (text) => {
    setIsTyping(text.length > 0); // Set typing state based on input length
    // Update Firestore document with typing status
    firestore()
      .collection('chats')
      .doc(chatId)
      .update({ isTyping: text.length > 0 });
  };

  const menuOptionsStyles = {
    optionsContainer: {
      marginTop: 30,
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 8,
      width: 150, // Set the width as needed
    },
    optionWrapper: {
      marginVertical: 10,
    },
    optionText: {
      fontSize: 16,
      color: 'black',
    },
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
          }}
          onInputTextChanged={handleTyping}
        />
      </View>
    </MenuProvider>
  );
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
});

export default ChatScreen;