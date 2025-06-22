import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Back() {
  const navigate = useNavigate();

  return (
    <Button key="x" onClick={() => navigate(-1)}>
      Back
    </Button>
  );
}
