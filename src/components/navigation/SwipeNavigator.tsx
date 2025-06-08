// @ts-ignore
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

  // SIEMPRE recalcula el índice en cada render
  const currentIdx = rutas.indexOf(location.pathname);

  // Si la ruta es desconocida, fuerza a 0
  useEffect(() => {
    if (currentIdx === -1) {
      navigate("/");
    }
  }, [currentIdx, navigate]);

  useEffect(() => {
    // Cuando cambia la ruta, mueve el slide SIEMPRE
    if (
      swiperRef.current &&
      swiperRef.current.activeIndex !== currentIdx &&
      currentIdx !== -1
    ) {
      swiperRef.current.slideTo(currentIdx, 0);
    }
  }, [currentIdx]);

  return (
    <Swiper
      initialSlide={currentIdx === -1 ? 0 : currentIdx}
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
