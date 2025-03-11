import { BarsBackgrounds } from './bars-backgrounds';

const DEFAULT = {
  _color: 'whitesmoke',
  _events: false,
};

export class BarsBackgroundsBuilder {
  private _color: string;
  private _events: boolean;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Determines the color of the background.
   *
   * @param value - The color of the background.
   *
   * If not called, the default color is 'whitesmoke'.
   */
  color(value: string): this {
    this._color = value;
    return this;
  }

  /**
   * Determines whether the background is interactive or not.
   *
   * @param value - If `true`, the background is interactive and will respond to Viz Components events. If `false`, the background is not interactive.
   *
   * If not called, the default value is `false`.
   */
  events(value: boolean): this {
    this._events = value;
    return this;
  }

  /**
   * @internal
   * This function is for internal use only and should never be called by the user.
   */
  _build(): BarsBackgrounds {
    return new BarsBackgrounds({
      color: this._color,
      events: this._events,
    });
  }
}
