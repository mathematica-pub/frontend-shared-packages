import { VicPointMarkersOptions } from './point-markers-options';

export class VicPointMarkers implements VicPointMarkersOptions {
  readonly display: boolean;
  readonly class: string;
  readonly growByOnHover: number;
  readonly radius: number;

  constructor(options: VicPointMarkersOptions) {
    Object.assign(this, options);
  }
}
