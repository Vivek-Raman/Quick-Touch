import { Icon as TheIcon } from '@iconify/react/dist/iconify.cjs';

interface IconProps {
  name: string;
}

export default function Icon({ name }: IconProps) {
  return <TheIcon icon={name} width="100%" height="100%" />;
}
