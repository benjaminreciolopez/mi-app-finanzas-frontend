import { motion } from "framer-motion";
import { useNavigationDirection } from "../../NavigationDirectionContext";

function PageWrapper({ children }: { children: React.ReactNode }) {
  const direction = useNavigationDirection();

  const variants = {
    initial: {
      x: direction === "left" ? "100%" : direction === "right" ? "-100%" : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      opacity: 0,
    },
  };

  return (
    <motion.div
      className="page-transition" // 👈 importante para ocupar el espacio y permitir transición
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
