import { BrowserMessage } from "./lib/helpers/chrome/messageHandler";

chrome.runtime.onMessage.addListener(
  (message: BrowserMessage, sender, sendResponse) => {
    console.log("on message event fired from the background script");
    console.log(message);
    console.log("Message type");
    console.log(message.type);
    if (message.type === "open-popup") {
      console.log("inside open-popup condition");
      chrome.windows.create({
        url: "popup.html", // Path to your HTML file
        type: "popup",
        width: 400, // Adjust the dimensions as needed
        height: 300,
      });
      console.log("Popped-up");
    }
  }
);

chrome.storage.onChanged.addListener((changes, area) => {
  console.log("local storage changes");
});

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("on installed event");
  console.log(details);
});
