import { useNavigate } from 'react-router-dom';
import Icon from '../../../common/Icon';
import { Stack, UnstyledButton } from '@mantine/core';

export default function Back({ style }: { style: React.CSSProperties }) {
  const navigate = useNavigate();

  return (
    <UnstyledButton style={style} onClick={() => navigate(-1)}>
      <Stack align="center" justify="center" style={style}>
        <Icon icon="tabler:arrow-left" size="2rem" />
      </Stack>
    </UnstyledButton>
  );
}
