import React, { useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import Message from './Message'
import { Menu, MenuOptions, MenuOption, MenuTrigger,MenuProvider } from 'react-native-popup-menu';

const messages = [
  { id: '1', sender: 'John', text: 'Hello!', timestamp: '10:00 AM' },
  { id: '2', sender: 'Alice', text: 'Hi there!', timestamp: '10:05 AM' },
  // Add more messages as needed
];

const ChatScreen = ({ route }) => {
  const { userId, userName } = route.params;
  const [messageInput, setMessageInput] = useState('');
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={item.sender === 'John' ? styles.myMessage : styles.otherMessage}>
      {item.sender !== 'John' && (
        <Image source={require("./assest/download.jpeg")} style={styles.profileUserImage} />
      )}
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

   const sendMessage = () => {
    if (messageInput.trim() !== '') {
      const newMessage = { id: messages.length + 1, sender: 'John', text: messageInput, timestamp: '11:00 AM' };
      setMessageInput('');
      messages.push(newMessage);
    }
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
          <Image source={require("./assest/download.jpeg")} style={styles.profileImage} />
          <Text style={styles.userName}>{userName}</Text>
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
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageInput}
            onChangeText={(text) => setMessageInput(text)}
            multiline
          />
          <TouchableOpacity onPress={sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} size={25} color="black" style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileUserImage: {
  	// marginRight: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  messagesContainer: {
    paddingVertical: 16,
  },
  myMessage: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  otherMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  messageContent: {
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendIcon: {
    marginLeft: 8,
  },
  icon: {
    marginLeft: 7,
  },
});


export default ChatScreen;