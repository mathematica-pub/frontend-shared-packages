import { StrokeBuilder } from '../../stroke/stroke-builder';
import { Grid } from './grid-config';

export class GridBuilder {
  private _filter: (i: number) => boolean;
  private strokeBuilder: StrokeBuilder;

  /**
   * OPTIONAL. Determines whether or not to display grid lines. Must specify a function
   *  that takes the index of the grid line and returns a boolean.
   *
   * Default: `(i) => i > 0`, but can be overriden to display all grid lines.
   */
  filter(filter: ((i: number) => boolean) | null) {
    if (filter === null) {
      this._filter = undefined;
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
  _build(axis: 'x' | 'y', dimension: 'quantitative' | 'ordinal'): Grid {
    this.validateBuilder();
    return new Grid({
      axis: axis,
      filter: this.getFilterForDimension(dimension),
      stroke: this.strokeBuilder._build(),
    });
  }

  private validateBuilder(): void {
    if (this.strokeBuilder === undefined) {
      this.initStrokeBuilder();
    }
  }

  private getFilterForDimension(
    dimension: 'quantitative' | 'ordinal'
  ): (i: number) => boolean {
    if (this._filter) return this._filter;
    if (dimension === 'quantitative') {
      return (i) => i > 0;
    } else {
      return () => true;
    }
  }
}
