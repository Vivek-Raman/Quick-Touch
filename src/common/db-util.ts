// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type PouchDB from 'pouchdb-browser';
import { Stage } from '../types/Stage';
import { SHORTCUTS_IN_STAGE } from './constants';
import ShortcutType from './enums/ShortcutType';

// eslint-disable-next-line import/prefer-default-export
export const createStage = async (
  db: PouchDB.Database<Stage>,
  parentID: string,
  stageId: string,
  stageName: string,
) => {
  return db.put({
    _id: stageId,
    parentID,
    name: stageName,
    children: [
      ...Array.from({ length: SHORTCUTS_IN_STAGE }).map((_, i) => {
        return { position: i, type: ShortcutType.EMPTY };
      }),
    ],
  });
};
