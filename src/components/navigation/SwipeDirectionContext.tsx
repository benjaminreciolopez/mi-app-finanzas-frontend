import { createContext, useContext, useState } from "react";

type Swipe = "left" | "right" | null; // 👈 ahora acepta null

const SwipeDirectionContext = createContext<Swipe>("right");
const SwipeDirectionUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<Swipe>>
>(() => {});

export function SwipeDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [swipeDirection, setSwipeDirection] = useState<Swipe>("right"); // 👈 valor inicial válido

  return (
    <SwipeDirectionContext.Provider value={swipeDirection}>
      <SwipeDirectionUpdateContext.Provider value={setSwipeDirection}>
        {children}
      </SwipeDirectionUpdateContext.Provider>
    </SwipeDirectionContext.Provider>
  );
}

export function useSwipeDirection() {
  return useContext(SwipeDirectionContext);
}

export function useSwipeDirectionUpdate() {
  return useContext(SwipeDirectionUpdateContext);
}
