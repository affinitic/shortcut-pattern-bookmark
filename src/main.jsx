import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

import { GET_LOCALSTORAGE } from "./constants/messageType";
import { LOCALSTORAGE_KEY } from "./constants/key";

chrome.runtime
  .sendMessage({ type: GET_LOCALSTORAGE, key: LOCALSTORAGE_KEY })
  .then((res) => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <App data={res} />
      </React.StrictMode>,
    );
  });
