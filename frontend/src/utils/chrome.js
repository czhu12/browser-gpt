export async function extractContentFromPage(uuid) {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  debugger;
  const response = await chrome.tabs.sendMessage(tab[0].id, { action: "EXTRACT" });
  return response
}
          