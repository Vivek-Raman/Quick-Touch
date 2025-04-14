import PouchDb from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { Button, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Stage } from '../../types/Stage';
import Loading from '../common/Loading';

export default function Onboarding() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initializeDB = async () => {
    const db = new PouchDb<Stage>('stage');
    await db.put({ _id: '0', name: 'Root', children: [] });
  };

  const start = () => {
    navigate('/editor');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await initializeDB();
      setLoading(false);
    })();
  }, []);

  if (loading) <Loading />;
  return (
    <>
      <Title>Quick-Touch</Title>
      <Button disabled={loading} onClick={() => start()}>
        Get started {'->'}
      </Button>
    </>
  );
}
