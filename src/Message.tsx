import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Image, RefreshControl, TextInput, Modal } from 'react-native';
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getAPIData();
    setIsRefreshing(false);
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
    setSearchResults([]);
  };

  const follow = async (id) => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/follow_user/${id}`, { headers });
      // Handle response if needed
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const renderUserItem = ({ item }) => (
      <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, userId: item.user_id, userProfile: item.profile_image.url })}>
        <Image source={{ uri: item.profile_image.url }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.user_name}</Text>
        </View>
        <Menu>
          <MenuTrigger style={{ padding: 10 }} >
            <Icon name="ellipsis-v" size={30} color="black" style={{ marginRight: 20 }}/>
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

  return (
  <MenuProvider skipInstanceCheck>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={data}
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
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
          />
        </View>
      </Modal>
    </View>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    marginTop: 40,
    // marginLeft: '40%',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
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
    // padding: 16,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
});

export default Message;
