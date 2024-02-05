import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Followers = () => {
  const navigation = useNavigation();
  // Dummy data for followers
  const followersData = [
    { id: '1', name: 'Follower 1', username: '@follower1', image: require("./assest/background.jpg") },
    { id: '2', name: 'Follower 2', username: '@follower2', image: require("./assest/background.jpg") },
    // Add more followers as needed
  ];
  const handleUnfollow = (followerId) => {
    const updatedFollowers = followersData.filter((follower) => follower.id !== followerId);
    setFollowersData(updatedFollowers);
  };
  // Render item for FlatList
  const renderFollowerItem = ({ item }) => (
    <View style={styles.followerItem}>
      <Image source={item.image} style={styles.followerImage} />
      <View style={styles.followerDetails}>
        <Text style={styles.followerName}>{item.name}</Text>
        <Text style={styles.followerUsername}>{item.username}</Text>
      </View>
      <TouchableOpacity onPress={() => handleUnfollow(item.id)} style={styles.unfollowButton}>
        <Text style={styles.unfollowButtonText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={followersData}
        keyExtractor={(item) => item.id}
        renderItem={renderFollowerItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  followerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  followerDetails: {
    flex: 1,
  },
  followerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  followerUsername: {
    color: '#888',
  },
  unfollowButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  unfollowButtonText: {
    color: '#fff',
  },
});

export default Followers;