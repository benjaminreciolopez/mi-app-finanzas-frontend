import { useLocation } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineControl,
  AiOutlineTool,
  AiOutlineLineChart,
  AiOutlineDollar,
} from "react-icons/ai";

interface Props {
  scrollContainer: React.RefObject<HTMLDivElement>;
}

function Navigation({ scrollContainer }: Props) {
  const location = useLocation();

  const handleScrollTo = (index: number) => {
    if (scrollContainer.current) {
      const width = scrollContainer.current.offsetWidth;
      scrollContainer.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { label: "Evolución", icon: <AiOutlineLineChart size={20} /> },
    { label: "Clientes", icon: <AiOutlineUser size={20} /> },
    { label: "Calendario", icon: <AiOutlineCalendar size={20} /> },
    { label: "Control", icon: <AiOutlineControl size={20} /> },
    { label: "Materiales", icon: <AiOutlineTool size={20} /> },
    { label: "Pagos", icon: <AiOutlineDollar size={20} /> },
  ];

  return (
    <nav className="top-nav">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          className={index === 0 ? "active" : ""}
          onClick={() => handleScrollTo(index)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
