import { useNavigate } from 'react-router-dom';
import type React from 'react';
import { ContainerShortcut } from '../../../types/Shortcut';
import Icon from '../../../common/Icon';
import { Button, Stack, UnstyledButton } from '@mantine/core';

interface ContainerProps {
  item: ContainerShortcut;
  style: React.CSSProperties;
}

export default function Container(props: ContainerProps) {
  const { item, style } = props;
  const navigate = useNavigate();

  return (
    <UnstyledButton
      onClick={() => {
        navigate(`/stage/${item.stageID}`);
      }}
    >
      <Stack align="center" justify="center" style={style}>
        <Icon icon="tabler:folder" size="2rem" />
      </Stack>
    </UnstyledButton>
  );
}
