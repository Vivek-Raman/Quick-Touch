export interface Config {
  key: string;
  value: string;
}

export type ConfigEntity = Config & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;
