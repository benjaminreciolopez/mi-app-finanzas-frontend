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
      <div className="container">
        <Evolucion />
      </div>
    </PageWrapper>,
    <PageWrapper key="clientes">
      <div className="container">
        <Clientes />
      </div>
    </PageWrapper>,
    <PageWrapper key="calendario">
      <div className="container">
        <Calendario />
      </div>
    </PageWrapper>,
    <PageWrapper key="control">
      <div className="container">
        <Control />
      </div>
    </PageWrapper>,
    <PageWrapper key="materiales">
      <div className="container">
        <Materiales />
      </div>
    </PageWrapper>,
    <PageWrapper key="pagos">
      <div className="container">
        <Pagos />
      </div>
    </PageWrapper>,
  ];

  return (
    <>
      <GlobalStyles />
      <Navigation />
      {/* <div className="container" style={{ paddingTop: "70px" }}>  <-- quita esto */}
      <SwipeNavigator childrenArray={pages} />
      {/* </div> */}
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
