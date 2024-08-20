import { LinesFill } from './lines-fill';

const DEFAULT = {
  _display: true,
  _opacity: 0.2,
};

export class LinesFillBuilder {
  private _display: boolean;
  private _opacity: number;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. A boolean to determine if fill under line should be displayed.
   *
   * @default true
   */
  display(display: boolean): this {
    this._display = display;
    return this;
  }

  /**
   * OPTIONAL. A number to determine the opacity of the fill under line.
   *
   * @default 0.2
   */
  opacity(opacity: number): this {
    this._opacity = opacity;
    return this;
  }

  /**
   * @internal This function is for internal use only and should never be called by the user.
   */
  _build(): LinesFill {
    return {
      display: this._display,
      opacity: this._opacity,
    };
  }
}
