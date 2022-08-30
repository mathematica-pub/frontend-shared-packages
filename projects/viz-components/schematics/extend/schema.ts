import { VizComponentType } from './schema.enums';

export interface Schema {
  name: string;
  extend: VizComponentType;
  path?: string;
  project?: string;
}
