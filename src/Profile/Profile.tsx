import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
  Share
} from 'react-native';
import axios from 'axios';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Posts from "../explore/Posts";
import Reels from "../explore/Reels";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [profileDetail, setProfileDetail] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const PostsRoute = () => (
    <Posts />
  );

  const MediaRoute = () => (
    <Reels />
  );

  const MusicRoute = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Coming soon.......</Text>
    </View>
  );

  const initialLayout = { width: Dimensions.get('window').width };

  const [routes] = useState([
    { key: 'posts', title: 'Posts', icon: 'film' },
    { key: 'media', title: 'Media', icon: 'image' },
    { key: 'music', title: 'Music', icon: 'music' },
  ]);

  const renderScene = SceneMap({
    posts: PostsRoute,
    media: MediaRoute,
    music: MusicRoute,
  });

  const shareContent = () => {
    Share.share({
      message: 'Your message to share', // Text content you want to share
    })
      .then(result => console.log(result))
      .catch(error => console.log(error));
  };

  const getAPIData = async () => {
    try {
      setIsRefreshing(true);
      setIsLoading(true); // Set loading state to true while fetching data
      const token = userInfo.data.authentication_token;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
      setProfileDetail(response.data);
      await AsyncStorage.removeItem('userInfo');
    } catch (error) {
      // console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false); // Set loading state to false after data is fetched
      setLoading(false);
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  const onRefresh = () => {
    getAPIData();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (profileDetail === null) {
    return (
      <View style={styles.noProfileContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Complete your profile details</Text>
        <TouchableOpacity
          style={styles.createProfileButton}
          onPress={() => navigation.navigate('CreateProfile')}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <MenuProvider skipInstanceCheck>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.container}
      >
        {isLoading && ( // Conditionally render loading indicator
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
          <View style={styles.headerIcons}>
            <Icon name="bell" size={20} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('ProfileSetting')} style={{ padding: 5 }}>
              <Icon name="cog" size={20} color="black" style={{ marginLeft: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={shareContent}>
              <Icon name="share-alt" size={20} color="black" style={{ marginLeft: 20 }} />
            </TouchableOpacity>
          </View>
        </View>
        {profileDetail.data.profile_background_image ? (
          <Image source={{ uri: profileDetail.data.profile_background_image.url }} style={styles.backgroundImage} />
        ) : (
          <Image source={require('../assest/app.png')} style={styles.backgroundImage} />
        )}
        <View style={styles.profileContainer}>
          <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
          <View style={styles.stats}>
            <TouchableOpacity onPress={() => navigation.navigate('Posts')} style={{ padding: 5 }}>
              <Text style={styles.statText}> Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Followers')} style={{ padding: 5 }}>
              <Text style={styles.statText}>{profileDetail.data.number_followers} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Following')} style={{ padding: 5 }}>
              <Text style={styles.statText}>{profileDetail.data.number_followings} Followings</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold', color: 'black' }}>@{profileDetail.data.user_name}</Text>
          <Text style={styles.name}>{profileDetail.data.name.charAt(0).toUpperCase() + profileDetail.data.name.slice(1)}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>Member since {profileDetail.data.created_at}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>Location: {profileDetail.data.country}</Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontSize: 20, color: 'black' }}>{profileDetail.data.about}</Text>
        </View>
        <View style={styles.socialLinks}>
          <Icon name="facebook" size={20} color="black" />
          <Icon name="linkedin" size={20} color="black" style={{ marginLeft: 20 }} />
          <Icon name="youtube" size={20} color="black" style={{ marginLeft: 20 }} />
          <Icon name="instagram" size={20} color="black" style={{ marginLeft: 20 }} />
        </View>
        <View style={styles.horizontalLine} />
          <View >
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  renderIcon={({ route, focused, color }) => (
                    <Icon name={route.icon} size={20} color='black' />
                  )}
                  tabStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                  style={{ backgroundColor: 'white' }}
                  indicatorStyle={{ backgroundColor: 'black' }}
                  inactiveColor="black"
                  activeColor="black"
                />
              )}
            />
          </View>
      </ScrollView>
    </MenuProvider>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 5,
    width: 120,
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    elevation: 5,
    position: 'relative',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statText: {
    fontSize: 18,
    marginLeft: 10,
  },
  name: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'white',
  },
  socialLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  blogImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  createProfileButton: {
    backgroundColor: '#2baed6',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  // Style for loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the loading indicator is above other content
  },
});

export default Profile;
