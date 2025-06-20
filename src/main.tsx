import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationDirectionProvider } from "./NavigationDirectionContext";
import { SwipeDirectionProvider } from "./components/navigation/SwipeDirectionContext";
import { BrowserRouter } from "react-router-dom"; // ⬅️ importa esto

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ⬅️ envuelve todo dentro */}
      <NavigationDirectionProvider>
        <SwipeDirectionProvider>
          <App />
        </SwipeDirectionProvider>
      </NavigationDirectionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
