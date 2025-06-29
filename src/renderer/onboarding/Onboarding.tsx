import PouchDb from 'pouchdb-browser';
import { Suspense, useEffect, useState } from 'react';
import { Button, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Stage } from '../../types/Stage';
import Loading from '../../common/Loading';
import type { Config } from '../../types/Config';
import ConfigKey from '../../common/enums/ConfigKey';
import { createStage } from '../../common/db-util';

export default function Onboarding() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initializeDB = async () => {
    const db = new PouchDb<Stage>('stage');
    await createStage(db, '', '0', 'Root');
    const configDb = new PouchDb<Config>('config');
    await configDb.put({ _id: ConfigKey.STAGE_ID_COUNTER, value: '1' });
    await configDb.put({ _id: ConfigKey.SETUP_COMPLETE, value: 'true' });
  };

  const start = () => {
    navigate('/stage');
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await initializeDB();
      setLoading(false);
    })();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Title>Quick-Touch</Title>
      <Button disabled={loading} onClick={() => start()}>
        Get started {'->'}
      </Button>
    </Suspense>
  );
}
