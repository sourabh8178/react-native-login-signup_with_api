import React,{useContext,useState, useEffect} from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import ChatScreen from '../ChatScreen'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';


const Message = ({ proc }) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();
  const [data, setData] = useState(undefined);

  // Dummy data for followers
  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/following_lists`, { headers });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, userId: item.user_id, userProfile: item.profile_image.url })}
    >
    <Text>{console.warn(item)}</Text>
      <Image source={{ uri: item.profile_image.url }} style={styles.profileImage} />
      <View style={styles.userInfo}>
      {/*<Text>{console.warn(item)}</Text>*/}
        <Text style={styles.userName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <Text style={styles.lastMessage}>{item.user_name}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
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