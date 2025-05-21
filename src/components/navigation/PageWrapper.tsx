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
      transition: {
        type: "spring",
        stiffness: 340,
        damping: 34,
        duration: 0.32,
      },
    },
    exit: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 32,
        duration: 0.28,
      },
    },
  };

  return (
    <motion.div
      className="page-transition"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: "100%", minHeight: "100%", position: "absolute" }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
