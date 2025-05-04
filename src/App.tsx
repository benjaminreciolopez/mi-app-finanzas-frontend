import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineControl,
  AiOutlineTool,
  AiOutlineLineChart,
} from "react-icons/ai";
import Calendario from "./components/Calendario/Calendario";
import Control from "./components/Control/Control";
import Materiales from "./components/Materiales/Materiales";
import Clientes from "./components/Clientes/Clientes";
import Evolucion from "./components/Evolucion/Evolucion";
import GlobalStyles from "./styles/GlobalStyles";
import Pagos from "./components/Pagos/Pagos";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineDollar } from "react-icons/ai";
import SwipeNavigator from "./components/navigation/SwipeNavigator"; // 👈 Añade esto
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/navigation/PageWrapper"; // 👈 nuevo import

// Barra superior de navegación
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
    {
      to: "/pagos",
      label: "Pagos",
      icon: <AiOutlineDollar size={20} />,
    },
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

function App() {
  const location = useLocation();

  return (
    <Router>
      <GlobalStyles />
      <Navigation />
      <SwipeNavigator>
        <div className="container" style={{ paddingTop: "70px" }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Evolucion />
                  </PageWrapper>
                }
              />
              <Route
                path="/clientes"
                element={
                  <PageWrapper>
                    <Clientes />
                  </PageWrapper>
                }
              />
              <Route
                path="/calendario"
                element={
                  <PageWrapper>
                    <Calendario />
                  </PageWrapper>
                }
              />
              <Route
                path="/control"
                element={
                  <PageWrapper>
                    <Control />
                  </PageWrapper>
                }
              />
              <Route
                path="/materiales"
                element={
                  <PageWrapper>
                    <Materiales />
                  </PageWrapper>
                }
              />
              <Route
                path="/pagos"
                element={
                  <PageWrapper>
                    <Pagos />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
        </div>
      </SwipeNavigator>
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
}
export default App;
