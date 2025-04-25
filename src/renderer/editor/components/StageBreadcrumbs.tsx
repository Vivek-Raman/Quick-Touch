import { Breadcrumbs, Anchor } from '@mantine/core';
import { LinkedLabel } from '../../../types/LinkedLabel';

interface StageBreadcrumbsProps {
  history: LinkedLabel[];
}

export default function StageBreadcrumbs(props: StageBreadcrumbsProps) {
  const { history } = props;

  return (
    <Breadcrumbs>
      {history.map((item) => (
        <Anchor key={item.id} href={item.id}>
          {item.label}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}
