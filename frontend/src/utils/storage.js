export const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function getAccessToken() {
  return await getStorage(ACCESS_TOKEN);
}
export async function putAccessToken(token) {
  return await putStorage(ACCESS_TOKEN, token);
}

export async function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[ACCESS_TOKEN]);
      }
    });
  });
}

export async function putStorage(key, value) {
  return new Promise((resolve, reject) => {
    const obj = {}
    obj[key] = value;
    chrome.storage.local.set(obj, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}