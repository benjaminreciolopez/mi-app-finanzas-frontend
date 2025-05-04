import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationDirectionProvider } from "./NavigationDirectionContext";
import { SwipeDirectionProvider } from "./components/navigation/SwipeDirectionContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NavigationDirectionProvider>
      <SwipeDirectionProvider>
        <App />
      </SwipeDirectionProvider>
    </NavigationDirectionProvider>
  </React.StrictMode>
);
