import { StrokeBuilder } from '../../stroke/stroke-builder';
import { GridLines } from './grid-lines-config';

const DEFAULT = {
  _display: () => true,
  _color: () => '#cccccc',
};

export class GridLinesBuilder {
  private _color: (i: number) => string;
  private _display: (i: number) => boolean;
  private strokeBuilder: StrokeBuilder;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Sets the color of the grid line. Can specify a string constant or a function
   *  that takes the index of the grid line and returns a color.
   *
   * @default #cccccc.
   */
  color(color: string | ((i: number) => string)) {
    this._color = typeof color === 'string' ? () => color : color;
    return this;
  }

  /**
   * OPTIONAL. Determines whether or not to display grid lines. Can specify a boolean value or a function
   *  that takes the index of the grid line and returns a boolean.
   */
  display(display: boolean | ((i: number) => boolean)) {
    this._display = typeof display === 'boolean' ? () => display : display;
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the grid line stroke.
   */
  stroke(setProperties?: (stroke: StrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new StrokeBuilder();
  }

  _build(): GridLines {
    this.validateBuilder();
    return new GridLines({
      color: this._color,
      display: this._display,
      stroke: this.strokeBuilder._build(),
    });
  }

  private validateBuilder(): void {
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
  }
}
