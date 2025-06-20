import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineControl,
  AiOutlineTool,
  AiOutlineLineChart,
  AiOutlineDollar,
} from "react-icons/ai";
import { useState, useEffect } from "react";

interface Props {
  scrollContainer: React.RefObject<HTMLDivElement | null>;
}

const navItems = [
  { label: "Evolución", icon: <AiOutlineLineChart size={20} /> },
  { label: "Clientes", icon: <AiOutlineUser size={20} /> },
  { label: "Calendario", icon: <AiOutlineCalendar size={20} /> },
  { label: "Control", icon: <AiOutlineControl size={20} /> },
  { label: "Materiales", icon: <AiOutlineTool size={20} /> },
  { label: "Pagos", icon: <AiOutlineDollar size={20} /> },
];

function Navigation({ scrollContainer }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToPage = (index: number) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({
        left: index * window.innerWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  // Detectar la pantalla activa al hacer scroll manual
  useEffect(() => {
    const el = scrollContainer.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / window.innerWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll);

    // ⚠️ Esto fuerza a que la pestaña inicial esté bien marcada
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  return (
    <nav className="top-nav">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          onClick={() => scrollToPage(index)}
          className={index === activeIndex ? "active" : ""}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
