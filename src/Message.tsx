import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, RefreshControl, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';


const Message = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/my_room`, { headers });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
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
      setIsLoading(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/search_user?name=${term}`, { headers });
      setSearchResults(response.data);
    } catch (error) {
      console.error('API error:', error.message);
      Alert.alert('Error', 'Failed to search users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('ChatScreen', { userName: item.name, userId: item.user_id, userProfile: item.profile_image.url })}>
      <Image source={{ uri: item.profile_image.url }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>@{item.user_name}</Text>
      </View>
      <Menu>
        <MenuTrigger style={styles.menuTrigger}>
          <Icon name="ellipsis-v" size={30} color="black" />
        </MenuTrigger>
        <MenuOptions customStyles={menuOptionsStyles}>
          <MenuOption text="View Profile" />
          <MenuOption text="Block" />
          <MenuOption text="Clear Chat" />
          <MenuOption text="Report" />
        </MenuOptions>
      </Menu>
    </TouchableOpacity>
  );

  const renderSearchUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userSearchItem} onPress={() => navigation.navigate('ChatScreen', { userName: item.name, userId: item.user_id, userProfile: item.profile_image.url })}>
      <Image source={{ uri: item.profile_image.url }} style={styles.profileSearchImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userSearchName}>{item.name}</Text>
        <Text style={styles.userSearchUsername}>@{item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const filterUsers = () => {
    if (searchText === '') {
      return data;
    } else {
      return data.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  };

  const filteredUsers = filterUsers();

  return (
    <MenuProvider skipInstanceCheck>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <View style={styles.container}>
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
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Icon name="user-plus" size={30} color="#fff" />
        </TouchableOpacity>
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
                <Icon name="times" size={25} color="black" />
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
            {isLoading ? (
              <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSearchUserItem}
              />
            )}
          </View>
        </Modal>
      </View>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: 60,
    marginRight: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    width: 150,
  },
  optionWrapper: {
    marginVertical: 8,
    marginHorizontal: 10
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 7,
    paddingRight: 7,
  },
  header: {
    backgroundColor: '#398ea8',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 2,
    borderColor:'#ddd',
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#fff',
    marginTop: 8
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    marginLeft: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 16,
    color: '#777',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3498db',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
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
  loader: {
    marginTop: 20,
  },
  menuTrigger: {
    padding: 10,
    marginRight: 15
  },
  userSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },

  profileSearchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userSearchName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userSearchUsername: {
    fontSize: 16,
    color: '#777',
  },
});

export default Message;
