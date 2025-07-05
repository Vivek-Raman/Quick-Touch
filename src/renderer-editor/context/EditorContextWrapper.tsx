import type React from 'react';
import { HistoryContextProvider } from './HistoryContext';
import { PositionContextProvider } from './PositionContext';
import { StageContextProvider } from './StageContext';

export default function EditorContextWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HistoryContextProvider>
      <StageContextProvider>
        <PositionContextProvider>{children}</PositionContextProvider>
      </StageContextProvider>
    </HistoryContextProvider>
  );
}
