import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import ToolSizeContext from './ToolSizeContext';

export default function ToolSizeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const expand = useCallback(() => {
    window.electron.ipcRenderer.expand();
  }, []);

  const collapse = useCallback(() => {
    window.electron.ipcRenderer.collapse();
  }, []);

  const value = useMemo(() => ({ expand, collapse }), [expand, collapse]);

  return (
    <ToolSizeContext.Provider value={value}>
      {children}
    </ToolSizeContext.Provider>
  );
}
