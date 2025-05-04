import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationDirection } from "../../NavigationDirectionContext";

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
  const currentIndex = rutas.indexOf(location.pathname);
  const { setDirection } = useNavigationDirection();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < rutas.length - 1) {
        setDirection("forward");
        navigate(rutas[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setDirection("backward");
        navigate(rutas[currentIndex - 1]);
      }
    },
    delta: 50,
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} style={{ height: "100%" }}>
      {children}
    </div>
  );
}

export default SwipeNavigator;
