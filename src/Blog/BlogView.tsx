import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext";
import Icon from 'react-native-vector-icons/FontAwesome';

const BlogView = ({ route }) => {
  const { id } = route.params;
  const [blogDetail, setBlog] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);

  const getAPIData = async () => {
    try {
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/blog/${id}`, { headers });
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBlog({ error: true });
    }
  };

  useEffect(() => {
    getAPIData();
  }, []);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleDeletePost = () => {
    // Code to delete post
    console.log('Post deleted');
    // Add your logic to delete the post
  };

  const handleReportPost = () => {
    // Code to report post
    console.log('Post reported');
    // Add your logic to report the post
  };

  if (blogDetail === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (blogDetail.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: blogDetail.data.profile.image.url }} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>{blogDetail.data.profile.name}</Text>
            <Text style={styles.createdAt}>{blogDetail.data.created_at}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleMenuClick}>
          <Icon name="ellipsis-v" size={30} color="black" style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: blogDetail.data.blog_image.url }} style={styles.blogImage} />
      <Text style={styles.blogTitle}>{blogDetail.data.title}</Text>
      <Text style={styles.blogBody}>{blogDetail.data.body}</Text>

      <View style={styles.likesContainer}>
        <Text style={styles.likesTitle}>Likes:</Text>
        <View style={styles.likesList}>
          {blogDetail.data.likes.map((like, index) => (
            <Image key={index} source={{ uri: like.url }} style={styles.likeImage} />
          ))}
        </View>
        <Text style={styles.likesCount}>{blogDetail.data.likes_count} people liked this</Text>
      </View>

      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments:</Text>
        {blogDetail.data.comments.map((comment, index) => (
          <View style={styles.commentItem} key={index}>
            <View style={styles.commentContent}>
              <Text style={styles.commentUserName}>{comment.name}</Text>
              <Text style={styles.commentText}>{comment.message}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Menu Bar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => {
          setShowMenu(!showMenu);
        }}
        >
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={handleDeletePost}>
            <Text style={styles.menuText}>Delete Post</Text>
          </Pressable>
          <Pressable style={styles.menuItem} onPress={handleReportPost}>
            <Text style={styles.menuText}>Report Post</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={handleMenuClick}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createdAt: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  menuIcon: {
    marginLeft: 8,
  },
  blogImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  blogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blogBody: {
    fontSize: 18,
    lineHeight: 24,
  },
  likesContainer: {
    marginTop: 16,
  },
  likesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  likesList: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  likeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  likesCount: {
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    marginBottom: 10,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 20,
    width: '80%',
    marginBottom: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default BlogView;
