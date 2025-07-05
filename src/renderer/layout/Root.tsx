import { Center, Transition, UnstyledButton } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../common/Icon';
import ToolSizeContext from '../context/ToolSizeContext';

export default function Root() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { collapse } = useContext(ToolSizeContext);

  useEffect(() => {
    collapse();

    setTimeout(() => {
      setMounted(true);
    }, 10);
  }, [collapse]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.body.classList.add('transparent-background');
    }, 250);
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('transparent-background');
    };
  }, []);

  return (
    <Center h="100%">
      <Transition transition="fade" duration={250} mounted={mounted}>
        {(styles) => (
          <UnstyledButton onClick={() => navigate('/stage/0')} style={styles}>
            <Icon icon="tabler:circle-plus" size="2rem" />
          </UnstyledButton>
        )}
      </Transition>
    </Center>
  );
}
