/* eslint-disable react/require-default-props */
import { IconProps, Icon as TheIcon } from '@iconify/react/dist/iconify.cjs';

export default function Icon({
  size = '1rem',
  ...props
}: IconProps & { size?: string | number }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <TheIcon {...props} width={size} height={size} />;
}
