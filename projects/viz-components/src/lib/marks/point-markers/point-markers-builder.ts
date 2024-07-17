import { VicPointMarkers } from './point-markers';

const DEFAULT = {
  _display: true,
  _radius: 3,
  _growByOnHover: 1,
};

export class PointMarkersBuilder {
  private _display: boolean;
  private _class: string;
  private _growByOnHover: number;
  private _radius: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * A boolean to determine if point markers will be displayed.
   *
   * Default is true.
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * A class to be added to the point markers.
   */
  class(className: string): this {
    this._class = className;
    return this;
  }

  /**
   * A value by which the point marker will expand on hover, in px.
   *
   * Default is 1.
   */
  growByOnHover(growByOnHover: number): this {
    this._growByOnHover = growByOnHover;
    return this;
  }

  /**
   * A value for the radius of the point marker, in px.
   *
   * Default is 3.
   */
  radius(radius: number): this {
    this._radius = radius;
    return this;
  }

  build(): VicPointMarkers {
    return new VicPointMarkers({
      display: this._display,
      class: this._class,
      growByOnHover: this._growByOnHover,
      radius: this._radius,
    });
  }
}
