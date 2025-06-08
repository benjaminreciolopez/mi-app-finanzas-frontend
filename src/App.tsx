import { BrowserRouter as Router, Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineControl,
  AiOutlineTool,
  AiOutlineLineChart,
  AiOutlineDollar,
} from "react-icons/ai";
import Calendario from "./components/Calendario/Calendario";
import Control from "./components/Control/Control";
import Materiales from "./components/Materiales/Materiales";
import Clientes from "./components/Clientes/Clientes";
import Evolucion from "./components/Evolucion/Evolucion";
import GlobalStyles from "./styles/GlobalStyles";
import Pagos from "./components/Pagos/Pagos";
import SwipeNavigator from "./components/navigation/SwipeNavigator";
import PageWrapper from "./components/navigation/PageWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Evolución", icon: <AiOutlineLineChart size={20} /> },
    { to: "/clientes", label: "Clientes", icon: <AiOutlineUser size={20} /> },
    {
      to: "/calendario",
      label: "Calendario",
      icon: <AiOutlineCalendar size={20} />,
    },
    { to: "/control", label: "Control", icon: <AiOutlineControl size={20} /> },
    {
      to: "/materiales",
      label: "Materiales",
      icon: <AiOutlineTool size={20} />,
    },
    { to: "/pagos", label: "Pagos", icon: <AiOutlineDollar size={20} /> },
  ];

  return (
    <nav className="top-nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={location.pathname === item.to ? "active" : ""}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function AppContent() {
  const pages = [
    <PageWrapper key="evolucion">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Evolucion />
        </div>
      </div>
    </PageWrapper>,
    <PageWrapper key="clientes">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Clientes />
        </div>
      </div>
    </PageWrapper>,
    <PageWrapper key="calendario">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Calendario />
        </div>
      </div>
    </PageWrapper>,
    <PageWrapper key="control">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Control />
        </div>
      </div>
    </PageWrapper>,
    <PageWrapper key="materiales">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Materiales />
        </div>
      </div>
    </PageWrapper>,
    <PageWrapper key="pagos">
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div className="container">
          <Pagos />
        </div>
      </div>
    </PageWrapper>,
  ];

  return (
    <>
      <GlobalStyles />
      <Navigation />
      {/* NO ENVUELVAS el SwipeNavigator en .container */}
      <SwipeNavigator childrenArray={pages} />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
