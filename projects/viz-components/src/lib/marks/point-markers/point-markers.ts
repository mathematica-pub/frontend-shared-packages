import { PointMarkersOptions } from './point-markers-options';

export class VicPointMarkers implements PointMarkersOptions {
  readonly display: boolean;
  readonly class: string;
  readonly growByOnHover: number;
  readonly radius: number;

  constructor(options: PointMarkersOptions) {
    Object.assign(this, options);
  }
}
