import { Directive, OnChanges, SimpleChanges } from '@angular/core';
import { NgOnChangesUtilities } from 'projects/app-dev-kit/src/public-api';
import { Chart } from '../charts';

export interface IMarks {
  chart: Chart;
  /**
   * drawMarks method
   *
   * All methods that require scales should be called from drawMarks. Methods
   * called from here should use scale.domain() or scale.range() to obtain those values
   * rather than this.config.dimension.domain or this.ranges.dimension.
   *
   * This method is called when scales emit from ChartComponent.
   */
  drawMarks: () => void;
  /**
   * getTransitionDuration method
   *
   * This method should return the duration of the transition to be used in the marks.
   */
  getTransitionDuration: () => number;
}

@Directive()
export abstract class Marks implements IMarks, OnChanges {
  chart: Chart;
  abstract drawMarks(): void;
  abstract getTransitionDuration(): number;
  abstract initFromConfig(): void;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      NgOnChangesUtilities.inputObjectChangedNotFirstTime(changes, 'config')
    ) {
      this.initFromConfig();
    }
  }
}
