import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';
import { LinkedLabel } from '../../types/LinkedLabel';

export const HistoryContext = createContext<{
  history: LinkedLabel[];
  pushHistory: (toAdd: LinkedLabel) => void;
  popHistory: () => void;
}>({
  history: [],
  pushHistory: () => {},
  popHistory: () => {},
});

export function HistoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<LinkedLabel[]>([]);

  const pushHistory = useCallback((toAdd: LinkedLabel) => {
    setHistory((prev) => {
      if (prev.lastIndexOf(toAdd) !== -1) {
        return prev;
      }
      return [...prev, toAdd];
    });
  }, []);

  const popHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      history,
      pushHistory,
      popHistory,
    }),
    [history, pushHistory, popHistory],
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}
