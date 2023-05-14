export const EXTRACT = "EXTRACT";
const TAGS_TO_REMOVE = [
  "script",
  "style",
  "iframe",
  "canvas",
  "svg",
  "img",
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "form",
  "noscript",
  "nav",
  "footer",
  "header",
  "aside",
  "video",
  "audio",
  "map",
]
const extractContent = () => {
  const body = document.querySelector("body").cloneNode(true)
  TAGS_TO_REMOVE.forEach((tag) => {
    const toRemove = body.querySelectorAll(tag);
    toRemove.forEach((el) => {
      el.remove();
    });
  });
  const str = body.textContent.replace(/[\s|\n]+/g, ' ').trim();
  return str
}

(async () => {
  // do something with response here, not outside the function
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === EXTRACT) {
        const content = extractContent();
        sendResponse({ content });
      }
    }
  );
  console.log('Loaded content script');
})();