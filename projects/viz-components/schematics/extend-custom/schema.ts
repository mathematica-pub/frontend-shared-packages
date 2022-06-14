import { VizComponentOption } from './schema.enums';

export interface Schema {
  // name of component
  name: string;
  // name of library component to extend
  extends: VizComponentOption;
}
