import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import ChatScreen from './ChatScreen'
import { useNavigation } from '@react-navigation/native';

const users = [
  {
    id: '1',
    name: 'John Doe',
    profileImage: "./assest/app.png", // Replace with actual image URLs
    lastMessage: 'Hello, how are you?',
    timestamp: '3h ago',
  },
  {
    id: '2',
    name: 'Alice Smith',
    profileImage: "./assest/download.jpeg",
    lastMessage: 'Sure, lets meet at 5 PM.',
    timestamp: '1d ago',
  },
  // Add more users as needed
];

const Message = ({ proc }) => {
	const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name })}
    >
      <Image source={require("./assest/download.jpeg")} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 16,
    color: '#777',
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default Message;