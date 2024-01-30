import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from './AuthContext';
import { BASE_URL } from './Config';
import axios from 'axios';
import Blog from './Blog';
import { useNavigation } from '@react-navigation/native';
import BlogView from './BlogView';

const HomeScreen = (props) => {
  const { userInfo, logout, isLoading } = useContext(AuthContext);
  const [data, setData] = useState(undefined);
  const navigation = useNavigation();
  const [viewType, setViewType] = useState('list');

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/blogs`, { headers });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  const handleReload = () => {
    getAPIData();
  };

  const handleBlogView = (blogId) => {
    navigation.navigate('BlogView', {
      id: blogId,
    });
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.gridItem}
      onPress={() => handleBlogView(item.id)}
    >
      <Image
        source={{ uri: item.image }} // Assuming item.image is a URL
        style={styles.blogImage}
      />
      <View style={styles.gridTextContainer}>
        <Text style={styles.gridText}>Title: {item.title}</Text>
        <Text style={styles.gridText}>Body: {item.body}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      {viewType === 'list' ? (
        <>
          <Text>List with API Call</Text>
          {data ? (
            data.data.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={{ padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
                onPress={() => handleBlogView(post.id)}
              >
                <Text style={{ backgroundColor: '#ddd' }}> ID: {post.id}</Text>
                <Text> Title: {post.title}</Text>
                <Text> Body: {post.body}</Text>
                <Image source={{ uri: post.blog_image.url }} style={styles.blogImage} />
              </TouchableOpacity>
            ))
          ) : (
            null
          )}
        </>
      ) : (
        <FlatList
          data={data ? data.blogs : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGridItem}
          numColumns={2} // Adjust the number of columns as needed
        />
      )}
      <View style={styles.container}>
        <Spinner visible={isLoading} />
        {userInfo ? (
          <>
            <Text style={styles.welcome}>Welcome </Text>
            <Button title="Logout" color="red" onPress={logout} />
            <TouchableOpacity onPress={() => props.navigation.navigate(Blog)}>
              <Text style={{ color: 'blue' }}>Create blog</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.welcome}>Welcome</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wraper: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'blue',
  },
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  gridTextContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  gridText: {
    fontSize: 14,
  },
});

export default HomeScreen;
