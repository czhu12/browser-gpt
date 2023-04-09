import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export async function createMessage(text) {
  return await axios.post(`${BASE_URL}/threads/${threadId}/messages`, { text }).data;
}

export async function showThread(threadId) {
  return await axios.get(`${BASE_URL}/threads/${threadId}`);
}

export async function createThreads() {
  return await axios.post(`${BASE_URL}/threads`);
}

export async function getThreads() {
  return await axios.get(`${BASE_URL}/threads`);
}