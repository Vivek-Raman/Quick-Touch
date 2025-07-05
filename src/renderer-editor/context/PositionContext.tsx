import type React from 'react';
import { createContext, useMemo, useState } from 'react';

export const PositionContext = createContext<{
  position: number;
  setPosition: (pos: number) => void;
}>({ position: -1, setPosition: () => {} });

export function PositionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [position, setPosition] = useState(0);

  const contextValue = useMemo(() => ({ position, setPosition }), [position]);

  return (
    <PositionContext.Provider value={contextValue}>
      {children}
    </PositionContext.Provider>
  );
}
