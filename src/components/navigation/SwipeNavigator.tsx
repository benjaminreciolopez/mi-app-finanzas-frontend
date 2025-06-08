import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";

const rutas = [
  "/",
  "/clientes",
  "/calendario",
  "/control",
  "/materiales",
  "/pagos",
];

interface SwipeNavigatorProps {
  childrenArray: React.ReactNode[];
}

function SwipeNavigator({ childrenArray }: SwipeNavigatorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const swiperRef = useRef<SwiperType | null>(null);

  // SIEMPRE calcular índice de slide por la ruta actual
  const currentIdx = rutas.indexOf(location.pathname);

  if (currentIdx === -1) return null;

  useEffect(() => {
    if (swiperRef.current && currentIdx !== swiperRef.current.activeIndex) {
      swiperRef.current.slideTo(currentIdx, 0);
    }
  }, [currentIdx]);

  return (
    <Swiper
      initialSlide={currentIdx} // ¡Siempre usa el current!
      onSlideChange={(swiper) => {
        const ruta = rutas[swiper.activeIndex];
        if (location.pathname !== ruta) {
          navigate(ruta);
        }
      }}
      resistanceRatio={0.5}
      speed={300}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      style={{
        height: "100vh",
        background: "#fff",
      }}
    >
      {childrenArray.map((component: React.ReactNode, idx: number) => (
        <SwiperSlide key={rutas[idx]}>{component}</SwiperSlide>
      ))}
    </Swiper>
  );
}
export default SwipeNavigator;
