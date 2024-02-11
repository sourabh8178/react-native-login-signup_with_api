import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import { useNavigation } from '@react-navigation/native';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {userInfo, isLoading} = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const searchApi = async (term) => {
      try {
      	const token = userInfo.data.authentication_token;
	      const headers = {
	        Authorization: `Bearer ${token}`,
	      };
        const response = await axios.get(`${BASE_URL}/search_user?name=${searchTerm}`, { headers });
        setSearchResults(response.data);
      } catch (error) {
        console.error('API error:', error.message);
      }
    };
    const debouncedSearch = debounce(searchApi, 300); 
     if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      // Clear the search results if the search term is empty
      setSearchResults([]);
    }
    return () => clearTimeout(debouncedSearch);
  }, [searchTerm]);

  // Function to bhandle the search
  const handleItemPress = (selectedUser) => {
    // Handle what happens when a user is selected

    setSearchTerm('');
    setSearchResults([]);
    console.warn(searchResults[0])
    navigation.navigate('UserProfile', { id: selectedUser.id });
  };


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users by name"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        style={styles.input}
        autoFocus={true}
        clearButtonMode="while-editing"
      />
      {/*<Text>{console.warn(searchResults)}</Text>*/}
      <FlatList
			  data={searchResults}
			  keyExtractor={(item) => item.id.toString()}
			  renderItem={({ item }) => (
			    <Text style={styles.resultItem} onPress={() => handleItemPress(item)}>
			      {item.name}
			    </Text>
			  )}
			/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
   flexDirection: 'row', 
   alignItems: 'center',
   // width: "95%",
   // marginLeft: "5%",
   marginTop: "2%",
   borderRadius: 30,
   // height: "3%",
   backgroundColor: "#d1cbcb",
    // borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 20
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SearchComponent;