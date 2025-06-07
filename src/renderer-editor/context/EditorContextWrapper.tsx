import type React from 'react';
import { HistoryContextProvider } from './HistoryContext';
import { StageContextProvider } from './StageContext';
import { PositionContextProvider } from './PositionContext';

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
