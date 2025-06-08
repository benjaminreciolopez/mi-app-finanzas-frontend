import { motion } from "framer-motion";

function PageWrapper({ children }: { children: React.ReactNode }) {
  // Ya no necesitamos direction ni variants con x.
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.18 } }}
      exit={{ opacity: 0, transition: { duration: 0.13 } }}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "relative", // no absolute
        background: "inherit",
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
