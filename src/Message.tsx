import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, RefreshControl, TextInput, Modal } from 'react-native';
import ChatScreen from '../ChatScreen';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const Message = ({ proc }) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState(undefined);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const onRefresh = () => {
    getAPIData();
  };

  const handleAddUser = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const onSearch = (text) => {
    setSearchText(text);
    searchApi(text);
  };

  const searchApi = async (term) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/search_user?name=${term}`, { headers });
      setSearchResults(response.data);
    } catch (error) {
      console.error('API error:', error.message);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredData(data);
  };

  const follow = (id) => {
    try {
        const token = userInfo.data.authentication_token;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = axios.get(`${BASE_URL}/follow_user/${id}`, { headers });
        // setProfileDetail(prevProfile => ({ ...prevProfile, follow: true }));
      } catch (error) {
        console.error('Error following user:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => addUserToChat(item.id)}
    >
      <Image source={{ uri: item.profile_image.url }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <Text style={styles.lastMessage}>{item.user_name}</Text>
      </View>
      <TouchableOpacity style={styles.addUserButton} onPress={follow(item.id)}>
        <Icon name="user-plus" size={25} color="#3498db" style={styles.addUserIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, userId: item.user_id, userProfile: item.profile_image.url })}
    >
      <Image source={{ uri: item.profile_image.url }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        <Text style={styles.lastMessage}>{item.user_name}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>Connect </Text>
          <TouchableOpacity style={styles.addUserButton} onPress={handleAddUser}>
            <Icon name="user-plus" size={25} color="#3498db" style={styles.addUserIcon} />
          </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="times" size={25} color="black" style={styles.modalIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              onChangeText={onSearch}
              value={searchText}
            />
            {searchText !== '' && (
              <TouchableOpacity onPress={clearSearch}>
                <Icon name="times" size={20} color="#555" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
  addUserButton: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    marginRight: 'auto',
    padding: 15,
  },
  addUserIcon: {
    color: '#3498db',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalIcon: {
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  clearIcon: {
    marginLeft: 10,
  },
});

export default Message;