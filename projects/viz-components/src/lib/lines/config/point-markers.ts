export class VicPointMarkers {
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

  constructor(options?: Partial<VicPointMarkers>) {
    this.display = true;
    this.radius = 3;
    this.growByOnHover = 1;
    Object.assign(this, options);
  }
}

export function vicPointMarkers(
  options?: Partial<VicPointMarkers>
): VicPointMarkers {
  return new VicPointMarkers(options);
}
