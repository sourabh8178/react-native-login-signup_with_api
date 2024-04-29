import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Image, StatusBar,  FlatList, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Alert, Dimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAPIData = async () => {
    try {
      setRefreshing(true); // Start refreshing
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/blogs`, { headers });
      setData(response.data);
    } catch (error) {
      console.log(error.response.data.errors);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

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

  const handleItemPress = (selectedUser) => {
    setSearchTerm('');
    setSearchResults([]);
    navigation.navigate('UserProfile', { id: selectedUser.id });
  };

  const onSearch = (text) => {
    setSearchText(text);
    searchApi(text);
  };

  const getRandomSize = () => {
    return Math.floor(Math.random() * (300 - 100 + 1)) + 100;
  };

  const renderSearchUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userSearchItem} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: item.profile_image.url }} style={styles.profileSearchImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userSearchName}>{item.name}</Text>
        <Text style={styles.userSearchUsername}>@{item.user_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    getAPIData();
  };

  const handleBlogView = (blogId) => {
    navigation.navigate('BlogView', {
      id: blogId,
    });
  };


  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
      <StatusBar backgroundColor="#147a99" barStyle="light-content" />
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <View style={styles.inputPost}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "5%", marginRight: "5%" }}>
              <Icon name="search" size={20} color="black" style={{ marginRight: "5%" }} />
              <Text style={{ fontSize: 20, color: "black" }}>Search users...</Text>
            </View>
          </View>
        </TouchableOpacity>
        {data && (
          <View style={styles.imageContainer}>
            {data.data.map((post) => (
              post.blog_image.blob !== "video/mp4" && (
                <TouchableOpacity key={post.id} onPress={() => handleBlogView(post.id)}>
                  <Image
                    source={{ uri: post.blog_image.url }}
                    style={[styles.blogImage, { width: getRandomSize(), height: getRandomSize() }]}
                  />
                </TouchableOpacity>
              )
            ))}
          </View>
        )}

        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Icon name="arrow-left" size={30} color="black" />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: windowWidth / 2 - 20,
    marginBottom: 20,
  },
  profileSearchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userSearchName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSearchUsername: {
    fontSize: 14,
    color: '#555',
  },
  inputPost: {
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 100,
    borderColor: 'grey'
  },
  blogImage: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e3dbc5',
    padding: 20,
    borderRadius: 20,
    borderColor: 'grey',
    elevation: 10,
    margin: 8
  },
  modalHeader: {
    width: '100%',
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "white",
    elevation: 10,
    // marginRight: 10,
    marginLeft: 50,
    marginTop: -30
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearIcon: {
    marginRight: 10,
  },
  userSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: 350,
    elevation: 10,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10
  },
  profileSearchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userSearchName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSearchUsername: {
    fontSize: 14,
    color: '#555',
  },
});

export default Explore;
