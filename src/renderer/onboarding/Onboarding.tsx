import PouchDb from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { Stage } from '../../types/Stage';
import { Button, Title } from '@mantine/core';

export default function Onboarding() {
  const [loading, setLoading] = useState<boolean>(false);

  const initializeDB = async () => {
    const db = new PouchDb<Stage>('stage');
    await db.put({ _id: '0', name: 'Root', children: [] });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await initializeDB();
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Title>Welcome to Quick-Touch!</Title>
      <Button>Get started {'->'}</Button>
    </>
  );
}
