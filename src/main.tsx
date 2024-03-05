import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "./index.css";
import { ContextProvider } from "./utils/ContextProvider.tsx";
import { reducer, initialState } from "./utils/reducer.tsx";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider initialState={initialState} reducer={reducer}>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
