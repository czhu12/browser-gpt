import axios from "axios";

export const BASE_URL = "https://backend.browsergpt.app";
export const API_URL = `${BASE_URL}/api`;

export async function getCurrentUser(uuid) {
  return await axios.get(`${API_URL}/current_user`, {
    headers: {
      "Content-Type": "application/json",
      "X-ACCESS-TOKEN": uuid,
    }
  })
};
export async function createNewUser() {
  const response = await axios.post(`${API_URL}/users`);
  const accessToken = response.data;
  return accessToken;
};

export async function createDocument(threadId, content) {
  const response = await axios.post(`${API_URL}/threads/${threadId}/documents`, { content });
  return response.data;
}

export async function createMessage({threadId, text}) {
  const response = await axios.post(`${API_URL}/threads/${threadId}/messages`, { text });
  return response.data;
}

export async function createThread() {
  return await axios.post(`${API_URL}/threads`);
}

export async function getThread(threadId) {
  const response = await axios.get(`${API_URL}/threads/${threadId}`);
  return response.data;
}

export async function getThreads() {
  const response = await axios.get(`${API_URL}/threads`);
  return response.data;
}