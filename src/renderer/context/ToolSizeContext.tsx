import { createContext } from 'react';

type ToolSizeContextType = {
  expand: () => void;
  collapse: () => void;
};

const ToolSizeContext = createContext<ToolSizeContextType>({
  expand: () => {},
  collapse: () => {},
});

export default ToolSizeContext;
