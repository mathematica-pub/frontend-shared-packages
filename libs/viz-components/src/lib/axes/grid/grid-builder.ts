import { StrokeBuilder } from '../../stroke/stroke-builder';
import { Grid } from './grid-config';

const DEFAULT = {
  _filter: () => true,
};

export class GridBuilder {
  private _filter: (i: number) => boolean;
  private strokeBuilder: StrokeBuilder;

  constructor() {
    Object.assign(this, DEFAULT);
  }

  /**
   * OPTIONAL. Determines whether or not to display grid lines. Must specify a function
   *  that takes the index of the grid line and returns a boolean.
   */
  filter(filter: ((i: number) => boolean) | null) {
    if (filter === null) {
      this._filter = DEFAULT._filter;
      return this;
    }
    this._filter = filter;
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the grid line stroke.
   *
   * Default color: '#cccccc'
   * Default width: 1px
   */
  stroke(stroke: null): this;
  stroke(stroke: (stroke: StrokeBuilder) => void): this;
  stroke(stroke: ((stroke: StrokeBuilder) => void) | null): this {
    if (stroke === null) {
      this.strokeBuilder = undefined;
      return this;
    }
    this.initStrokeBuilder();
    stroke(this.strokeBuilder);
    return this;
  }

  private initStrokeBuilder(): void {
    this.strokeBuilder = new StrokeBuilder().width(1).color('#cccccc');
  }

  /**
   * @internal
   * This function is for internal use only and should never be called by the user.
   */
  _build(axis: 'x' | 'y'): Grid {
    this.validateBuilder();
    return new Grid({
      axis: axis,
      filter: this._filter,
      stroke: this.strokeBuilder._build(),
    });
  }

  private validateBuilder(): void {
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
  }
}
