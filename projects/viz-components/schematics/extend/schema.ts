import { VizComponentOption } from './schema.enums';

export interface Schema {
  name: string;
  extend: VizComponentOption;
  path?: string;
  project?: string;
}
