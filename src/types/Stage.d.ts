import { Item } from './Item';

export interface Stage {
  name: string;
  children: Item[];
}

export type StageEntity = Stage & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;
