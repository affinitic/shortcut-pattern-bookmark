/*global chrome*/

import { useEffect, useState } from "react";

import {
  GET_TAB_URL,
  CLICK_SHORTCUT,
  SET_LOCALSTORAGE,
} from "../constants/messageType";
import { LOCALSTORAGE_KEY } from "../constants/key";

export const useGetCurrentTabUrl = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage({ type: GET_TAB_URL }, (res) => {
      setUrl(res);
    });
  }, []);

  if (url === "") {
    return "";
  } else {
    return url;
  }
};

export const onClickShortcut = (patern, newTab) => {
  chrome.runtime.sendMessage({ type: CLICK_SHORTCUT, patern, newTab });
};

export function setStorageList(data) {
  chrome.runtime.sendMessage({
    type: SET_LOCALSTORAGE,
    key: LOCALSTORAGE_KEY,
    data,
  });
}
