const DEFAULT = {
  display: true,
  radius: 3,
  growByOnHover: 1,
};

export interface VicPointMarkersOptions {
  /**
   * A boolean to determine if point markers will be displayed.
   *
   * Default is true.
   */
  display: boolean;
  /**
   * A value for the radius of the point marker, in px.
   *
   * Default is 3.
   */
  radius: number;
  /**
   * A value by which the point marker will expand on hover, in px.
   *
   * Default is 1.
   */
  growByOnHover: number;
}

export class VicPointMarkers implements VicPointMarkersOptions {
  readonly display: boolean;
  readonly radius: number;
  readonly growByOnHover: number;

  constructor(options?: Partial<VicPointMarkers>) {
    Object.assign(this, DEFAULT, options);
  }
}
