import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationDirectionUpdate } from "../../NavigationDirectionContext";
import { useSwipeDirectionUpdate } from "./SwipeDirectionContext";
import { useRef } from "react";

const rutas = [
  "/",
  "/clientes",
  "/calendario",
  "/control",
  "/materiales",
  "/pagos",
];

function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setDirection = useNavigationDirectionUpdate();
  const setSwipe = useSwipeDirectionUpdate();
  const swiping = useRef(false);

  const currentIndex = rutas.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwiped: () => {
      // Evita swipes dobles y restablece dirección tras animar
      setTimeout(() => setSwipe("none"), 340);
      swiping.current = false;
    },
    onSwipedLeft: () => {
      if (swiping.current) return;
      swiping.current = true;
      if (currentIndex < rutas.length - 1) {
        setDirection("left");
        setSwipe("left");
        navigate(rutas[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (swiping.current) return;
      swiping.current = true;
      if (currentIndex > 0) {
        setDirection("right");
        setSwipe("right");
        navigate(rutas[currentIndex - 1]);
      }
    },
    delta: 50,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  // El style asegura altura y oculta desbordes, ideal para móviles
  return (
    <div
      {...handlers}
      className="page-container"
      style={{
        minHeight: "calc(100vh - 56px)",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
    >
      {children}
    </div>
  );
}

export default SwipeNavigator;
