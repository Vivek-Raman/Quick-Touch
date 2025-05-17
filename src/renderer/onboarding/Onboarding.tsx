import PouchDb from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { Button, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Stage } from '../../types/Stage';
import Loading from '../common/Loading';
import type { Config } from '../../types/Config';
import ConfigKey from '../enums/ConfigKey';
import { Shortcut } from '../../types/Shortcut';
import ShortcutType from '../enums/ShortcutType';
import { createStage } from '../common/db-util';

export default function Onboarding() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initializeDB = async () => {
    const db = new PouchDb<Stage>('stage');
    await createStage(db, '0');
    const configDb = new PouchDb<Config>('config');
    await configDb.put({ _id: ConfigKey.STAGE_ID_COUNTER, value: '1' });
    await configDb.put({ _id: ConfigKey.SETUP_COMPLETE, value: 'true' });
  };

  const start = () => {
    navigate('/editor/0');
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
