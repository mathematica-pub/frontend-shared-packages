import { VicPointMarkers } from './point-markers';

const DEFAULT = {
  _display: true,
  _radius: 3,
  _growByOnHover: 2,
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
   * OPTIONAL. A boolean to determine if point markers will be displayed.
   *
   * @default true
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * OPTIONAL. A string to be added as a class to the point markers.
   */
  class(className: string): this {
    this._class = className;
    return this;
  }

  /**
   * OPTIONAL. A value by which the point marker will expand on hover, in px.
   *
   * @default 2
   */
  growByOnHover(growByOnHover: number): this {
    this._growByOnHover = growByOnHover;
    return this;
  }

  /**
   * OPTIONAL. A value for the radius of the point marker, in px.
   *
   * @default 3
   */
  radius(radius: number): this {
    this._radius = radius;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): VicPointMarkers {
    return new VicPointMarkers({
      display: this._display,
      class: this._class,
      growByOnHover: this._growByOnHover,
      radius: this._radius,
    });
  }
}
