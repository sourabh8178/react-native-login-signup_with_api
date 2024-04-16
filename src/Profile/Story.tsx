import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../Auth/AuthContext';
import { BASE_URL } from '../Auth/Config';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

const Story = () => {
    const { userInfo } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [storyData, setStoryData] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    let intervalId;

    useEffect(() => {
        getAPIData();
    }, [userInfo]);

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
            console.error('Error fetching stories:', error);
            Alert.alert('Error fetching stories. Please try again later.');
        }
    };

    const openModel = (story) => {
        setShowModal(true);
        setStoryData(story.stories);
        setCurrentIndex(0);
        startSlideshow();
    };

    const closeModal = () => {
        setShowModal(false);
        setStoryData(null);
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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {data && data.data ? (
                    data.data.map((story, index) => (
                        <TouchableOpacity key={index} onPress={() => openModel(story)}>
                            <View style={styles.profileContainer}>
                                <Image key={index} source={{ uri: story.profile_image.url }} style={styles.profileImage} />
                            </View>
                            <Text>{story.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text>No stories available</Text>
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
														    {storyData && storyData.map((image, index) => (
														        <View key={index} style={styles.slide}>
														            <Image source={{ uri: image.url }} style={styles.modalImage} />
														        </View>
														    ))}
														</Swiper>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'linear-gradient(red, yellow)',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        paddingTop: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // padding: 15,
        backgroundColor: '#fff',
        // alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    storyContainer: {
        width: '100%',
        height: 100,
        // borderRadius: 30,
        overflow: 'hidden',
    },
    swiperImage: {
        width: '100%',
        height: '100%',
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
    }
});

export default Story;
