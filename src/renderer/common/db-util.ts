import type PouchDB from 'pouchdb-browser';
import { Stage } from '../../types/Stage';
import ShortcutType from '../enums/ShortcutType';
import { SHORTCUTS_IN_STAGE } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const createStage = async (
  db: PouchDB.Database<Stage>,
  stageId: string,
) => {
  await db.put({
    _id: stageId,
    name: 'New Stage',
    children: [
      ...Array.from({ length: SHORTCUTS_IN_STAGE }).map((_, i) => {
        return { position: i, type: ShortcutType.EMPTY };
      }),
    ],
  });
};
