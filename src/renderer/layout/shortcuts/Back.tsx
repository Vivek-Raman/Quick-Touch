import { Button } from '@mantine/core';
import { useContext } from 'react';
import StageContext from '../../editor/context/StageContext';

export default function Back() {
  const { stage } = useContext(StageContext);

  const goBack = () => {
    stage;
  };

  return (
    <Button key="x" onClick={goBack}>
      Back
    </Button>
  );
}
