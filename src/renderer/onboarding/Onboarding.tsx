import { Center, UnstyledButton } from '@mantine/core';
import PouchDb from 'pouchdb-browser';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStage } from '../../common/db-util';
import ConfigKey from '../../common/enums/ConfigKey';
import Icon from '../../common/Icon';
import Loading from '../../common/Loading';
import type { Config } from '../../types/Config';
import { Stage } from '../../types/Stage';

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
    navigate('/root');
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
      <Center h="100%">
        <UnstyledButton disabled={loading} onClick={() => start()}>
          <Icon icon="tabler:arrow-right" />
        </UnstyledButton>
      </Center>
    </Suspense>
  );
}
