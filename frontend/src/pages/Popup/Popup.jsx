import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import ChatInterface from './components/ChatInterface';
import "./Popup.scss"
import axios from 'axios';
import Loading from './components/Loading';
import { Notyf } from 'notyf';

import { getAccessToken, putAccessToken } from '../../utils/storage';
import { createNewUser, getCurrentUser } from '../../utils/api';
const configureAxios = (accessToken) => {
  axios.defaults.headers.common = {
    "Content-Type": "application/json",
    "X-ACCESS-TOKEN": accessToken,
  };

  axios.interceptors.response.use(response => {
    return response;
  }, error => {
    if (!error) return;
    if (error.config?.method !== 'get' && error.response?.status === 401) {
      const notyf = new Notyf();
      notyf.error('You are not allowed to do that!');
    }
    throw error;
  });
}
const Popup = () => {
  const canConfirmAccessToken = async (accessToken) => {
    try {
      await getCurrentUser(accessToken.uuid)
      return true
    } catch(error) {
      if (error?.response?.status === 401) {
        return false
      }
      return true
    }
  }
  const createOrLoadUser = async () => {
    const accessToken = await getAccessToken();
    const confirmed = !!accessToken && (await canConfirmAccessToken(accessToken));
    if (confirmed) {
      return accessToken
    } else {
      return await createNewUser()
    }
  }
  
  const [accessToken, setAccessToken] = useState(null);
  const configureEverything = async () => {
    const accessToken = await createOrLoadUser()
    await putAccessToken(accessToken)
    setAccessToken(accessToken.uuid)
    configureAxios(accessToken.uuid)
  }
  useEffect(() => {
    // Bootstrap the user token if the storage doesn't have it
    configureEverything()
  }, []);
  return (
    <UserContext.Provider value={{ accessToken: accessToken }}>
      {!accessToken && <Loading />}
      {accessToken && <ChatInterface />}
    </UserContext.Provider>
  );
};

export default Popup;
