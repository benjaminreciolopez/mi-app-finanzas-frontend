import { createContext, useContext, useState } from "react";

type Direction = "left" | "right" | null;

const SwipeDirectionContext = createContext<{
  direction: Direction;
  setDirection: (dir: Direction) => void;
}>({
  direction: null,
  setDirection: () => {},
});

export function SwipeDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<Direction>(null);

  return (
    <SwipeDirectionContext.Provider value={{ direction, setDirection }}>
      {children}
    </SwipeDirectionContext.Provider>
  );
}

export function useSwipeDirection() {
  return useContext(SwipeDirectionContext);
}
