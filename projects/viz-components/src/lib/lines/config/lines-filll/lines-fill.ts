import { LinesFillOptions } from './lines-fill-options';

export class LinesFill {
  readonly display: boolean;
  readonly opacity: number;

  constructor(options: LinesFillOptions) {
    Object.assign(this, options);
  }
}
