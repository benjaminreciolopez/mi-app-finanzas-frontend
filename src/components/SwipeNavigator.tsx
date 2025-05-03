import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";

const rutas = [
  "/",
  "/clientes",
  "/calendario",
  "/control",
  "/materiales",
  "/pagos",
];

export default function SwipeNavigator({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const index = rutas.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < rutas.length - 1) navigate(rutas[index + 1]);
    },
    onSwipedRight: () => {
      if (index > 0) navigate(rutas[index - 1]);
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div {...handlers} style={{ height: "100%", width: "100%" }}>
      {children}
    </div>
  );
}
