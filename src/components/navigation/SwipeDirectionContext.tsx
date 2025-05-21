import { createContext, useContext, useState } from "react";

type Swipe = "left" | "right" | "none";

const SwipeDirectionContext = createContext<Swipe>("none");
const SwipeDirectionUpdateContext = createContext<
  React.Dispatch<React.SetStateAction<Swipe>>
>(() => {});

export function SwipeDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [swipeDirection, setSwipeDirection] = useState<Swipe>("none");

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
