 /*global chrome*/

import React, { 
  useEffect,
  useState,
  useCallback,
  experimental_useEffectEvent as useEffectEvent 
} from "react";

import {
  GET_TAB_URL,
  CLICK_SHORTCUT,
  GET_LOCALSTORAGE,
  SET_LOCALSTORAGE
} from '../constants/messageType';
import {  LOCALSTORAGE_KEY } from '../constants/key';


export const useGetCurrentTabUrl = () => {
  const [url, setUrl] = useState("")
  
  useEffect(() => {
    chrome.runtime.sendMessage({type:GET_TAB_URL}, (res)=>{
      setUrl(res);
    })
  },[]);

  if (url === "") {
    return '';
  }else{
    return url;
  }
}

const useGetResponse = () => {
  const [value, setValue] = useState(null);

  const fireMessage = (type, args = {}) => {
    chrome.runtime.sendMessage({type:type, ...args}).then((res)=>{
      setValue(res)
    })
  }

  return [value, fireMessage];
}

export const onClickShortcut = (patern, newTab) => {
  chrome.runtime.sendMessage({type:CLICK_SHORTCUT,patern,newTab})
}

export function setStorageList(data) {
  console.log("🚀 ~ file: chrome.js:52 ~ setStorageList ~ data:", data)
  chrome.runtime.sendMessage({type:SET_LOCALSTORAGE,key:LOCALSTORAGE_KEY,data});
}

export async function getStorageList() {
  chrome.runtime.sendMessage({type:GET_LOCALSTORAGE}, (res => {
    return res;
  }));
  return [];
}

export const useLocalStorage = (key, initialValue) => {
  const [response, sendMessage] = useGetResponse()
  const readValue = useCallback(() => {
    try {
      sendMessage(GET_LOCALSTORAGE,{key})

      chrome.runtime.sendMessage({type:GET_LOCALSTORAGE, key}).then((res) =>{
        console.log("🚀 ~ file: chrome.js:53 ~ chrome.runtime.sendMessage ~ res:", JSON.parse(res))
        setFoobar(res);
        return res ? JSON.parse(res) : initialValue;
      });
      console.log("🚀 ~ file: chrome.js:52 ~ readValue ~ foobar:", foobar)

    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [localState, setLocalState] = useState(readValue);
  console.log("🚀 ~ file: chrome.js:62 ~ useLocalStorage ~ localState:", localState)
  const handleSetState = useCallback(
    (value) => {
      try {
        const nextState =
          typeof value === "function" ? value(localState) : value;
        chrome.runtime.sendMessage({type:SET_LOCALSTORAGE, key, data: JSON.stringify(nextState)});
        setLocalState(nextState);
        window.dispatchEvent(new Event("local-storage"));
      } catch (e) {
        console.warn(e);
      }
    },
    [key, localState]
  );

  const onStorageChange = useEffectEvent(() => {
    setLocalState(readValue());
  });

  useEffect(() => {
    window.addEventListener("storage", onStorageChange);
    window.addEventListener("local-storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("local-storage", onStorageChange);
    };
  }, []);

  return [localState, handleSetState];

}