import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationDirectionUpdate } from "../../NavigationDirectionContext";
import { useSwipeDirectionUpdate } from "./SwipeDirectionContext";

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

  const currentIndex = rutas.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwiped: () => {
      // Resetear dirección después de swipe para evitar conflictos
      setSwipe(null);
    },
    onSwipedLeft: () => {
      if (currentIndex < rutas.length - 1) {
        setDirection("left");
        setSwipe("left");
        navigate(rutas[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setDirection("right");
        setSwipe("right");
        navigate(rutas[currentIndex - 1]);
      }
    },
    delta: 50,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false, // evita navegación involuntaria con mouse
  });

  return (
    <div {...handlers} style={{ height: "100%", overflow: "hidden" }}>
      {children}
    </div>
  );
}

export default SwipeNavigator;
