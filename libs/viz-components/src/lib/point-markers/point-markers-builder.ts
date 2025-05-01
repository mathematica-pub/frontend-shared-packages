import { safeAssign } from '@hsi/app-dev-kit';
import { PointMarkers } from './point-markers';

const DEFAULT = {
  _class: () => '',
  _display: () => true,
  _radius: 3,
  _growByOnHover: 2,
};

export class PointMarkersBuilder<Datum> {
  private _display: (d: Datum) => boolean;
  private _class: (d: Datum) => string;
  private _growByOnHover: number;
  private _radius: number;

  constructor() {
    safeAssign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Provides a class on the SVG element that correspends to a single datum. If a datum creates multiple SVG elements -- for example, a rect and a label, the class will be applied on the parent SVGGElement.
   *
   * IF the chart does not have SVG elements that correspond to a single datum, this class will be placed on the SVG element that represents a collection of data, for example, a area in a stacked area chart, or a line in a line chart. In this case the datum passed to the callback function will be the first datum in the collection.
   *
   * Note that if the resultant string has spaces in the name, multiple classes will be applied. For example, if the class is 'North Carolina', the element will have the classes 'North' and 'Carolina'.
   */
  class(value: null): this;
  class(value: string): this;
  class(value: (d: Datum) => string): this;
  class(value: ((d: Datum) => string) | string | null): this {
    if (value === null) {
      this._class = DEFAULT._class;
      return this;
    }
    if (typeof value === 'string') {
      this._class = () => value;
      return this;
    }
    this._class = value;
    return this;
  }

  /**
   * OPTIONAL. A boolean to determine if point markers will be _displayed_.
   *
   * This is used to configure the visibilty of markers -- a `true` value will set the `display` of markers to `block`, while a `false` value will set the display of the markers to `none`.
   *
   * One use case is to have markers hidden until a user interaction, such as hover.
   *
   * If a function is provided, markers whose filtering predicate returns `true` will have `display: block` while those whose predicate returns `false` will have `display: none` when the markers are drawn.
   *
   * @default () => true
   */
  display(display: boolean): this;
  display(display: (d: Datum) => boolean): this;
  display(display: boolean | ((d: Datum) => boolean)): this {
    this._display = typeof display === 'boolean' ? () => display : display;
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
  _build(): PointMarkers<Datum> {
    return new PointMarkers({
      datumClass: this._class,
      display: this._display,
      growByOnHover: this._growByOnHover,
      radius: this._radius,
    });
  }
}
