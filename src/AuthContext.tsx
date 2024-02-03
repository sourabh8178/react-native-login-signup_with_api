import React, { createContext, useState, useEffect } from 'react';
import { BASE_URL } from "./Config";
import axios from 'axios';
import BlogView from './BlogView'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState({});
	const [blogInfo, setBlogInfo] = useState({});
  const [profileInfo, setProfileInfo] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [splashLoading, setSplashLoading] = useState(false);


	
  const register = (name, email, password) => {
  	setIsLoading(true);
    axios.post(`${BASE_URL}/users/sign_up`, {
      name, email, password
    })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
	      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
	      setIsLoading(false);
        console.log(userInfo);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
      });
  };

  const login = (email, password) => {
  	setIsLoading(true);
  	axios
  	.post(`${BASE_URL}/users/login`, {
      email, password
    })
    .then(res => {
      let userInfo = res.data;
      console.log(userInfo);
      setUserInfo(userInfo);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLoading(false);
    })
    .catch(e => {
      console.log(`Login error ${e}`);
      setIsLoading(false);
    });
  };

  const logout = () => {
  	setIsLoading(true);
  	axios
  	.post(`${BASE_URL}/users/logout`, {
      },
      {headers:  {Authorization: `Bearer ${userInfo.authentication_token}`},
      },
      )
    .then(res => {
      let userInfo = res.data;
      console.log(userInfo);
      setUserInfo(userInfo);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLoading(false);
    })
    .catch(e => {
      console.log(`Logout error ${e}`);
      setIsLoading(false);
    });
  };

  const isLoggedIn = async () => {
  	try{
  		setSplashLoading(true);
  		let userInfo  = await AsyncStorage.getItem('userInfo');
  		userInfo = JSON.parse(userInfo);
  		if (userInfo) {
  			setUserInfo(userInfo);
  		}
  		setSplashLoading(false);
  	} catch(e) {
  		setSplashLoading(false);
  		console.log(`is logged in error ${e}`);
  	}
  };

  const updateProfile = (userInfo, editedData) => {
    setIsLoading(true);
    axios.put(`${BASE_URL}/update_profile`, {
        editedData
      },
      { headers:
        {Authorization: `Bearer ${userInfo.data.authentication_token}`},
      }
    )
      .then(res => {
        let profileInfo = res.data;
        setBlogInfo(profileInfo);
        AsyncStorage.setItem('profileInfo', JSON.stringify(profileInfo));
        setIsLoading(false);
        console.log(profileInfo);
        // handleBlogView(profileInfo.id);
      })
      .catch(e => {
        console.log(`register error ${e}`);
        setIsLoading(false);
    });
  };

  useEffect(() => {
  	isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{login, updateProfile, splashLoading, register, isLoading, userInfo, logout}}>{children}</AuthContext.Provider>
  );
};
