import { PointMarkersOptions } from './point-markers-options';

export class PointMarkers<Datum> implements PointMarkersOptions<Datum> {
  readonly display: (d: Datum) => boolean;
  readonly growByOnHover: number;
  readonly radius: number;

  constructor(options: PointMarkersOptions<Datum>) {
    Object.assign(this, options);
  }
}
