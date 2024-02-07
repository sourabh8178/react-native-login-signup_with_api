import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const BlogGrid = ({ data, handleBlogView }) => {
  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.gridItem}
      onPress={() => handleBlogView(item.id)}
    >
      <Image style={styles.image} source={{ uri: item.image }} />
      <Text>ID: {item.id}</Text>
      <Text>Title: {item.title}</Text>
      <Text>Body: {item.body}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data ? data.blogs : []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderGridItem}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 8,
  },
});

export default BlogGrid;