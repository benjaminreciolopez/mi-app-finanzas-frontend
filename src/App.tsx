import { useRef } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import PantallasSwipeables from "./components/PantallasSwipeables";
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const scrollRef = useRef<HTMLDivElement>(null!);

  return (
    <>
      <GlobalStyles />
      <Navigation scrollContainer={scrollRef} />
      <PantallasSwipeables scrollRef={scrollRef} />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
