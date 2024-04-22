import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const Story = ({ refresh }) => {
    const { userInfo } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [myStory, setMyStory] = useState(null);
    const [profileDetail, setProfileDetail] = useState(null);
    const [storyData, setStoryData] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showMyStory, setShowMyStory] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [seenStory, setSeenStory] = useState([]);
    const [id, setId] = useState(null);
    const navigation = useNavigation();
    let intervalId;

    useEffect(() => {
    	if (refresh) {
        getUserData();
        getAPIData();
        // getMyStory();
      }
    }, [refresh]);

    const getUserData = async () => {
      try {
          setIsRefreshing(true);
          const token = userInfo.data.authentication_token;
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(`${BASE_URL}/view_profile`, { headers });
          setProfileDetail(response.data);
      } catch (error) {
          console.log(error.response.data.errors);
      } finally {
          setIsRefreshing(false);
      }
    };

    const getAPIData = async () => {
        try {
            if (!userInfo || !userInfo.data || !userInfo.data.authentication_token) {
                return;
            }
            const token = userInfo.data.authentication_token;
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/stories`, { headers });
            setData(response.data);
        } catch (error) {
        		setData(null);
            console.error('Error fetching stories:', error);
        }
    };

    const handleCreateStory = () => {
        if (!title && !image) {
			    Alert.alert('Please enter title or select image.');
			    return;
				}

				const formData = new FormData();
        formData.append('title', title);
        if (image) {
				  formData.append('story_image', {
				    uri: image.assets[0].uri,
				    type: image.assets[0].type,
				    name: image.assets[0].fileName,
				  });
				}

			try {
			  axios.post(`${BASE_URL}/stories`, formData, {
			    headers: {
			      Authorization: `Bearer ${userInfo.data.authentication_token}`,
			      'Content-Type': 'multipart/form-data',
			    },
			  })
		    .then((res) => {
		      console.log(res.data);
		      handleSend();
		    })
		    .catch((error) => {
		      const errorMessage = error.response.data.errors;
		      alert(errorMessage);
		      setIsLoading(false);
		    });
			  } catch (errors) {
		      Alert.alert('Error', 'Failed to create story. Please try again later.');
			  }
    };

    const toggleUserList = () => {
        setShowUserList(!showUserList);
    };

    const openModel = (story) => {
    	console.warn("a", story )
      setShowModal(true);
      setStoryData(story);
      const storyId = story.story_id;
      setSeenStory(prevState => [...prevState, storyId]);
      setId(storyId);
      // setCurrentIndex(0);
      // startSlideshow();
    };

    const openMyStoryModal = (story) => {
      setShowMyStory(true);
      setStoryData(story);
      const storyId = story.story_id;
      setSeenStory(prevState => [...prevState, storyId]);
      setId(storyId);
      // setCurrentIndex(0);
      // startSlideshow();
    };

    const seenStoryStatus = async () => {
    	try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      await axios.post(`${BASE_URL}/mark_as_seen/${id}`, {}, { headers });
	    } catch (error) {
	      console.log(error.response.data.errors);
	    }
    }

    const closeModal = () => {
      setShowModal(false);
      setStoryData(null);
      seenStoryStatus();
      stopSlideshow();
    };

    const closeMyStory = () => {
      setShowMyStory(false);
      setStoryData(null);
      seenStoryStatus();
      stopSlideshow();
    };

    const startSlideshow = () => {
        intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= (storyData || []).length) {
                    clearInterval(intervalId);
                    setTimeout(() => {
                        closeModal();
                    }, 5000);
                }
                return nextIndex;
            });
        }, 5000);
    };

    const stopSlideshow = () => {
        clearInterval(intervalId);
    };

    const deleteStory = async (postId) => {
	    try {
	      const token = userInfo.data.authentication_token;
	      const headers = { Authorization: `Bearer ${token}` };
	      const response = await axios.delete(`${BASE_URL}/delete_story/${postId}`, { headers });
	      setShowMyStory(false);
      	setStoryData(null);
      	setShowUserList(!showUserList)
	      getAPIData();
	    } catch (error) {
	      console.error('Error fetching data:', error);
	    }
	  };

    const showDeleteConfirmation = (storyId) => {
	    Alert.alert(
	      'Confirm Deletion',
	      'Are you sure you want to delete this post?',
	      [
	        { text: 'Cancel', style: 'cancel' },
	        { text: 'Delete', onPress: () => deleteStory(storyId) }
	      ],
	      { cancelable: true }
	    );
	  };

    const openCheckModel = (story) => {
		    if (story.id === userInfo.data.id)
		        openMyStoryModal(story);
		    else
		        openModel(story);
		};

    return (
        <View style={styles.container}>
            <ScrollView horizontal>
			        {data && data.data && data.data.some(story => story.id === userInfo.data.id) ? (
			            data.data.map((story, index) => (
			                <TouchableOpacity
			                    key={index}
			                    onPress={() => {
			                        openCheckModel(story);
			                    }}
			                >
			                    <View style={[
			                        styles.profileContainer,
			                        { borderColor: story.stories && seenStory.includes(story.stories.story_id) ? 'black' : 'red' }
			                    ]}>
			                        <Image source={{ uri: story.profile_image.url }} style={styles.profileImage} />
			                    </View>
			                    <Text>{story.name ? story.name : ''}</Text>
			                </TouchableOpacity>
			            ))
			        ) : (
			            profileDetail && (
			                <View>
			                    <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate("CreateStory")}>
			                        <Image source={{ uri: profileDetail.data.profile_image.url }} style={styles.profileImage} />
			                        <Text>Your story</Text>
			                    </TouchableOpacity>
			                    <Icon name="plus" size={18} color="white" style={styles.plusIcon} />
			                </View>
			            )
			        )}
			    	</ScrollView>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
              >
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <TouchableOpacity onPress={closeModal}>
                        <Icon name="times" size={25} color="white" style={styles.closeIcon} />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <View style={styles.imageContainer}>
                            <Swiper index={currentIndex} style={styles.swiper}>
													    <Text>xxz</Text>
													</Swiper>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showMyStory}
                transparent={true}
                animationType="slide"
                onRequestClose={closeMyStory}
              >
                <View style={styles.modalContainer}>
                    <View style={styles.overlay} />
                    <TouchableOpacity onPress={closeMyStory}>
                        <Icon name="times" size={25} color="white" style={styles.closeIcon} />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <View style={[styles.imageContainer, showUserList ? styles.imageContainerSmall : null]}>
                            <Swiper index={currentIndex} style={styles.swiper}>
														    {storyData && storyData.stories ?  (
														    	<Image source={{ uri: storyData.stories.url }} style={styles.modalImage} />
														    ) : (
														        <View style={styles.textOverlay}>
												              <Text style={styles.storyText}>{storyData ? storyData.title : ''}</Text>
												            </View>
														    )}
														</Swiper>
														{showUserList && (
															<TouchableOpacity  onPress={toggleUserList} style={styles.eyeUpIconContainer}>
						                  <Icon name="chevron-down" size={25} color="black" style={styles.eyeIcon} />
						              		</TouchableOpacity>
						              		)}
														<TouchableOpacity  onPress={toggleUserList} style={styles.eyeIconContainer}>
					                  <Icon name="eye" size={18} color="black" style={styles.eyeIcon} />
					              		</TouchableOpacity>
														{showUserList && (
                          		<View style={styles.userListContainer}>
                          		<View style={styles.deleteButtonContainer}>
														    <TouchableOpacity onPress={() => showDeleteConfirmation(storyData.story_id)}>
														        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
														            <Icon name="trash" size={25} color="black" style={styles.closeIcon} />
														        </View>
														    </TouchableOpacity>
														  </View>
														    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
														        <Icon name="eye" size={20} color="black" />
														        <Text style={{ marginLeft: 5, color: 'black' }}>{storyData && storyData.seen_users ? storyData.seen_users.length : 0} Users</Text>
														    </View>
														    {storyData && storyData.seen_users && storyData.seen_users.map((user, index) => (
														        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
															            <Image source={{ uri: user.url }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 5 }} />
															            <Text style={{ color: "black" }}>{user.name}</Text>
														        </View>
														    ))}
															</View>
		                        )}
                        </View>
                    </View>
	                  
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 10
    },
    profileContainer: {
      position: 'relative',
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
      marginRight: 10,
      borderWidth: 3
    },
    profileImage: {
      width: '100%',
      height: '100%',
    },
    plusIcon: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 40,
      bottom: 15,
      right: 9,
      backgroundColor: 'black',
      borderColor: "white",
      borderWidth: 2,
      padding: 7
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'yellow',
      padding: 16,
      paddingTop: 30,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
      opacity: 0.5,
    },
    modalContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    textOverlay: {
	    position: 'absolute',
	    top: 0,
	    left: 0,
	    right: 0,
	    bottom: 0,
	    justifyContent: 'center',
	    alignItems: 'center',
	    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	storyText: {
	    color: 'white',
	    fontSize: 20,
	    fontWeight: 'bold',
	},
	imageContainerSmall: {
        height: 200,
    },
    eyeUpIconContainer: {
    	justifyContent: 'center',
    	alignItems: 'center',
      position: 'absolute',
	    bottom: 375,
	    // left: 10,
	    height: 50,
      width: "110%",
      backgroundColor: 'white',
      // borderRadius: 20,
    },
    eyeIconContainer: {
    	justifyContent: 'center',
    	alignItems: 'center',
      position: 'absolute',
	    bottom: 10,
	    left: 10,
	    height: 50,
      width: 50,
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 2
    },
    eyeIcon: {
  		justifyContent: 'center',
    	alignItems: 'center',
    },
    userListContainer: {
      position: 'absolute',
      bottom: -20,
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      height: "50%",
      width: "110%",
    },
    deleteButtonContainer: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    paddingLeft: 10,
	    paddingRight: 10,
	    paddingBottom: 10,
		},
});

export default Story;
