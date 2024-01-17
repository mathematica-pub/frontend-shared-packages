import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { InternSet, range, scaleBand } from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicGroupedBarsConfig } from './grouped-bars.config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-grouped-bars]',
  templateUrl: '../bars/bars.component.html',
  styleUrls: ['./grouped-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: GroupedBarsComponent }],
})
export class GroupedBarsComponent extends BarsComponent {
  @Input() override config: VicGroupedBarsConfig;
  groupScale: any;

  override setMethodsFromConfigAndDraw(): void {
    this.setValueArrays();
    this.initNonQuantitativeDomains();
    this.setValueIndicies();
    this.setHasBarsWithNegativeValues();
    this.initUnpaddedQuantitativeDomain();
    this.setQuantitativeDomainPadding();
    this.initCategoryScale();
    this.setScaledSpaceProperties();
    this.setGroupScale();
    this.drawMarks(this.chart.transitionDuration);
  }

  override setValueIndicies(): void {
    // no unit test
    this.values.indicies = range(
      this.values[this.config.dimensions.ordinal].length
    ).filter((i) => {
      return (
        (this.config.ordinal.domain as InternSet).has(
          this.values[this.config.dimensions.ordinal][i]
        ) &&
        (this.config.category.domain as InternSet).has(this.values.category[i])
      );
    });
  }

  setGroupScale(): void {
    if (this.config.dimensions.ordinal === 'x') {
      this.groupScale = scaleBand(this.config.category.domain, [
        0,
        (this.xScale as any).bandwidth(),
      ]).padding(this.config.intraGroupPadding);
    } else {
      this.groupScale = scaleBand(this.config.category.domain, [
        (this.yScale as any).bandwidth(),
        0,
      ]).padding(this.config.intraGroupPadding);
    }
  }

  override getBarColor(i: number): string {
    return this.config.category.colorScale(this.values.category[i]);
  }

  override getBarXOrdinal(i: number): number {
    return (
      this.xScale(this.values.x[i]) + this.groupScale(this.values.category[i])
    );
  }

  override getBarY(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarYQuantitative(i);
    } else {
      return this.getBarYOrdinal(i);
    }
  }

  override getBarYOrdinal(i: number): number {
    return (
      this.yScale(this.values.y[i]) + this.groupScale(this.values.category[i])
    );
  }

  override getBarYQuantitative(i: number): number {
    return this.yScale(this.values.y[i]);
  }

  override getBarWidthOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }

  override getBarHeightOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }
}
