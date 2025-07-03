import { Center, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Icon from '../../common/Icon';

export default function Root() {
  const navigate = useNavigate();
  return (
    <Center h="100%">
      <UnstyledButton onClick={() => navigate('/stage/0')}>
        <Icon icon="tabler:circle-plus" size="2rem" />
      </UnstyledButton>
    </Center>
  );
}
