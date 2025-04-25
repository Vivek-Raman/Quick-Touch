import { Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Back() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.hash.split('/').indexOf('editor') !== -1) {
      navigate(-1);
    }
  };

  return <Button onClick={goBack}>Back</Button>;
}
