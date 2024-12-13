import { StrokeBuilder } from '../../stroke/stroke-builder';
import { GridLines } from './grid-lines-config';

const DEFAULT = {
  _filter: () => true,
  _color: () => '#cccccc',
};

export class GridLinesBuilder {
  private _color: (i: number) => string;
  private _filter: (i: number) => boolean;
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
   * OPTIONAL. Determines whether or not to display grid lines. Must specify a function
   *  that takes the index of the grid line and returns a boolean.
   */
  filter(filter: (i: number) => boolean) {
    this._filter = filter;
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
    this.strokeBuilder = new StrokeBuilder().width(1);
  }

  _build(axis: 'x' | 'y'): GridLines {
    this.validateBuilder();
    return new GridLines({
      color: this._color,
      filter: this._filter,
      stroke: this.strokeBuilder._build(),
      axis: axis,
    });
  }

  private validateBuilder(): void {
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
  }
}
