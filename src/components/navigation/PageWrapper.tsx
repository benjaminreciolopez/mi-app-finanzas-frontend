import { motion } from "framer-motion";
import { useNavigationDirection } from "../../NavigationDirectionContext";

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { direction } = useNavigationDirection();
  const isForward = direction === "forward";

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: isForward ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isForward ? -100 : 100 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
