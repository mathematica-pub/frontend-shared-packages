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
  filter(filter: (i: number) => boolean) {
    this._filter = filter;
    return this;
  }

  /**
   * OPTIONAL. A config for the behavior of the grid line stroke.
   *
   * Default color: '#cccccc'
   * Default width: 1px
   */
  stroke(setProperties?: (stroke: StrokeBuilder) => void): this {
    this.initStrokeBuilder();
    setProperties?.(this.strokeBuilder);
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
