import { SvgTextWrapConfig } from './svg-wrap.config';

export class TickWrapConfig extends SvgTextWrapConfig {
  wrapWidth: 'bandwidth' | number;
  override width: never;
  constructor(init?: Partial<TickWrapConfig>) {
    super();
    Object.assign(this, init);
  }
}
