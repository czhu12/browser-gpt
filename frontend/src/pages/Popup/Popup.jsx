import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import ChatInterface from './components/ChatInterface';
import "./Popup.scss"
import axios from 'axios';
import Loading from './components/Loading';

import { getAccessToken, putAccessToken } from '../../utils/storage';
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
  const createOrLoadUser = async () => {
    const accessToken = await getAccessToken();
    if (!!accessToken.uuid) {
      setAccessToken(accessToken.uuid);
    } else {
      const response = await axios.post(`http://localhost:3001/api/users`);
      const accessToken = response.data;
      await putAccessToken(accessToken);
      setAccessToken(accessToken);
    }
    configureAxios(accessToken.uuid);
  }
  
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    // Bootstrap the user token if the storage doesn't have it
    createOrLoadUser();
  }, []);
  return (
    <UserContext.Provider value={{ accessToken: accessToken }}>
      {!accessToken && <Loading />}
      {accessToken && <ChatInterface />}
    </UserContext.Provider>
  );
};

export default Popup;
