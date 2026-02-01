export type KeyType = 'apiKey' | 'idSecret';

export interface ApiKey {
  id: string;
  type: KeyType;
  name: string;
  key?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppData {
  version: string;
  keys: ApiKey[];
}
