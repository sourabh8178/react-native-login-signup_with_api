import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icons as needed
import { AuthContext } from './Auth/AuthContext';
import { BASE_URL } from './Auth/Config';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/my_notifications`, { headers });
      setNotifications(response.data.data);
    } catch (error) {
      console.log(error.response.data.errors);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const readNotification = async (id) => {
    console.warn(id)
    try {
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${BASE_URL}/my_notifications/${id}`, { headers });
      fetchData();
    } catch (error) {
      console.log(error.response.data.errors);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    
  };

  const handleNotificationPress = (item) => {
    readNotification(item.id);
    if (item.notification_type === "follow") {
      navigation.navigate("UserProfile", {
        id: item.url_id,
      });
    }
    else {
      navigation.navigate('BlogView', {
        id: item.url_id,
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      style={[
        styles.notificationItem,
        !item.is_read && styles.unreadNotification,
      ]}
    >
      <Image source={{ uri: item.user_profile.url }} style={styles.profileImage} />
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="bell" size={18} color={item.is_read ? "#f00" : "#f00"} style={{ marginRight: 10 }} />
        <Text style={[styles.notificationText, item.is_read ? false : styles.unreadText]}>
          {item.heading}
        </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{marginLeft: 40}}>{item.notification_type}</Text>
          <Text style={styles.notificationDate}>{ item.created_at}</Text>
        </View>
      </View>
          {item.image && (
            <Image source={{ uri: item.image.url }} style={styles.sideImage} />
          )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9Bd35A', '#689F38']}
            // Uncomment the line below if you want the progress indicator to hide when not refreshing
            tintColor="transparent"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 10,
    backgroundColor: "white"
  },
  unreadNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 20,
    backgroundColor: "#e3dfd5"
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 60,
    // borderWidth: 1,
    borderColor: 'white',
    marginRight: 10,
    borderColor: 'grey'
  },
  sideImage: {
    width: 60,
    height: 50,
    borderRadius: 20,
    // borderWidth: 1,
    borderColor: 'white',
    marginLeft: 50,
    borderColor: 'grey'
  },
});

export default NotificationScreen;
