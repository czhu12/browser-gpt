import axios from "axios";

export const BASE_URL = "http://localhost:3001";
export const API_URL = "http://localhost:3001/api";

export async function createMessage({threadId, text}) {
  const response = await axios.post(`${API_URL}/threads/${threadId}/messages`, { text });
  return response.data;
}

export async function createThread() {
  return await axios.post(`${API_URL}/threads/`);
}

export async function getThread(threadId) {
  const response = await axios.get(`${API_URL}/threads/${threadId}`);
  return response.data;
}

export async function getThreads() {
  const response = await axios.get(`${API_URL}/threads`);
  return response.data;
}