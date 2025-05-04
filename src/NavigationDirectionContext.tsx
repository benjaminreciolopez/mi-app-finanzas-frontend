import { createContext, useContext, useState } from "react";

const NavigationDirectionContext = createContext<{
  direction: "forward" | "backward";
  setDirection: (dir: "forward" | "backward") => void;
}>({
  direction: "forward",
  setDirection: () => {},
});

export const useNavigationDirection = () =>
  useContext(NavigationDirectionContext);

export function NavigationDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  return (
    <NavigationDirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </NavigationDirectionContext.Provider>
  );
}
