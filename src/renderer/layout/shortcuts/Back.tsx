import { useNavigate } from 'react-router-dom';
import { Stack, UnstyledButton } from '@mantine/core';
import Icon from '../../../common/Icon';

export default function Back() {
  const navigate = useNavigate();

  return (
    <UnstyledButton onClick={() => navigate(-1)}>
      <Stack align="center" justify="center">
        <Icon icon="tabler:arrow-left" size="2rem" />
      </Stack>
    </UnstyledButton>
  );
}
