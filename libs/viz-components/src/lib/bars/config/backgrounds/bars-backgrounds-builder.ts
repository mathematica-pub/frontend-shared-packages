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
   * Sets the color of the background.
   *
   * @default 'whitesmoke'
   */
  color(color: string): this {
    this._color = color;
    return this;
  }

  /**
   * Sets whether the background is interactive or not.
   *
   * @default false
   */
  events(events: boolean): this {
    this._events = events;
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
