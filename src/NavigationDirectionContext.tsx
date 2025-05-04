import { createContext, useContext, useState } from "react";

type Direction = "left" | "right" | "none";

const NavigationDirectionContext = createContext<Direction>("none");
const NavigationDirectionUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<Direction>>
>(() => {});

export function NavigationDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<Direction>("none");

  return (
    <NavigationDirectionContext.Provider value={direction}>
      <NavigationDirectionUpdateContext.Provider value={setDirection}>
        {children}
      </NavigationDirectionUpdateContext.Provider>
    </NavigationDirectionContext.Provider>
  );
}

export const useNavigationDirection = () =>
  useContext(NavigationDirectionContext);
export const useNavigationDirectionUpdate = () =>
  useContext(NavigationDirectionUpdateContext);
