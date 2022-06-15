import { VizComponentOption } from './schema.enums';

export interface Schema {
  name: string;
  extends: VizComponentOption;
  path?: string;
  project?: string;
}
