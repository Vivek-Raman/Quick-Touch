// import { Icon as TheIcon } from '@iconify/react/dist/iconify.cjs';
import { Text } from '@mantine/core';

interface IconProps {
  name: string;
}

export default function Icon({ name }: IconProps) {
  return <Text>{name}</Text>;
  // return <TheIcon icon={name} width="100%" height="100%" />;
}
