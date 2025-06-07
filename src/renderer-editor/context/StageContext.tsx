import { createContext, useState, useMemo } from 'react';
import type PouchDB from 'pouchdb-browser';
import { Stage } from '../../types/Stage';

export const StageContext = createContext<{
  stage: (Stage & PouchDB.Core.IdMeta) | null;
  setStage: (newStage: Stage & PouchDB.Core.IdMeta) => void;
}>({
  stage: null,
  setStage: () => {},
});

export function StageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStage, setCurrentStage] = useState<
    (Stage & PouchDB.Core.IdMeta) | null
  >(null);

  const contextValue = useMemo(
    () => ({ stage: currentStage, setStage: setCurrentStage }),
    [currentStage],
  );

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  );
}
