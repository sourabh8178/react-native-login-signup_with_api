import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from "../Auth/Config";
import { AuthContext } from "../Auth/AuthContext";
import Icon from 'react-native-vector-icons/FontAwesome';

const Comments = ({ route }) => {
  const { postId } = route.params;
  const { userInfo } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const token = userInfo.data.authentication_token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(`${BASE_URL}/comments/${postId}`, { headers });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, userInfo]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const token = userInfo.data.authentication_token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      post_id: postId,
      comment: commentText.trim(),
    };

    try {
      await axios.post(`${BASE_URL}/comment`, data, { headers });
      setCommentText('');
      const response = await axios.get(`${BASE_URL}/comments/${postId}`, { headers });
      setComments(response.data);
      scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.commentsContainer}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          comments && comments.data ? (
            comments.data.map((comment, index) => (
              <View key={comment.id} style={styles.commentContainer}>
                <Image source={{ uri: comment.profile_image.url }} style={styles.profileImage} />
                <View style={styles.commentDetails}>
                  <Text style={styles.userName}>{comment.name}</Text>
                  <Text style={styles.commentDate}>{comment.created_at}</Text>
                  <Text style={styles.commentText}>{comment.message}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>No comments available</Text>
          )
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          onSubmitEditing={handleAddComment}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Icon name="send" size={25} color="#147a99" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentDetails: {
    flex: 1,
    marginLeft: 10,
    marginTop: 20
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
  },
  commentDate: {
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default Comments;
