/*global chrome*/

import {
  GET_TAB_URL,
  CLICK_SHORTCUT,
  GET_LOCALSTORAGE,
  SET_LOCALSTORAGE,
} from "./constants/messageType";
import { newUrlGeneration } from "@root/utils/url";

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.type == GET_TAB_URL) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      callback(tab.url);
    });
    return true;
  } else if (message.type == CLICK_SHORTCUT) {
    if (message.newTab) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const newUrl = newUrlGeneration(tab.url, message.patern);
        chrome.tabs.create({ url: newUrl });
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        const newUrl = newUrlGeneration(tab.url, message.patern);
        chrome.tabs.update(tab.id, { url: newUrl });
      });
    }
    return true;
  } else if (message.type == GET_LOCALSTORAGE) {
    chrome.storage.local.get([message.key]).then(
      (res) => {
        if (!res[message.key]) {
          callback([]);
          return true;
        }

        let resultJson = res[message.key];
        callback(JSON.parse(resultJson));
        return true;
      },
      (error) => {
        callback([]);
        return true;
      },
    );
    return true;
  } else if (message.type == SET_LOCALSTORAGE) {
    chrome.storage.local.set({ [message.key]: JSON.stringify(message.data) });
    return true;
  }
});
