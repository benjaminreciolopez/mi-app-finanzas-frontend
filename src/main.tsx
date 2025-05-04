import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationDirectionProvider } from "./NavigationDirectionContext"; // 👈

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NavigationDirectionProvider>
      <App />
    </NavigationDirectionProvider>
  </React.StrictMode>
);
