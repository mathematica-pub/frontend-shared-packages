import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { scaleBand } from 'd3';
import { BarDatum, BarsComponent } from '../bars/bars.component';
import { VicDataValue } from '../core/types/values';
import { VIC_DATA_MARKS } from '../data-marks/data-marks';
import { VicGroupedBarsConfig } from './config/grouped-bars.config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-grouped-bars]',
  templateUrl: '../bars/bars.component.html',
  styleUrls: ['./grouped-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: VIC_DATA_MARKS, useExisting: GroupedBarsComponent }],
})
export class GroupedBarsComponent<
  Datum,
  TOrdinalValue extends VicDataValue
> extends BarsComponent<Datum, TOrdinalValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('config') override config: VicGroupedBarsConfig<Datum, TOrdinalValue>;
  groupScale: any;

  override drawMarks(): void {
    this.setGroupScale();
    super.drawMarks();
  }

  setGroupScale(): void {
    if (this.config.dimensions.ordinal === 'x') {
      this.groupScale = scaleBand(this.config.categorical.calculatedDomain, [
        0,
        (this.scales.x as any).bandwidth(),
      ]).padding(this.config.intraGroupPadding);
    } else {
      this.groupScale = scaleBand(this.config.categorical.calculatedDomain, [
        (this.scales.y as any).bandwidth(),
        0,
      ]).padding(this.config.intraGroupPadding);
    }
  }

  override getBarColor(d: BarDatum<TOrdinalValue>): string {
    return this.scales.categorical(d.categorical);
  }

  override getBarXOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.x(d.ordinal) + this.groupScale(d.categorical);
  }

  override getBarY(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarYQuantitative(d);
    } else {
      return this.getBarYOrdinal(d);
    }
  }

  override getBarYOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.ordinal) + this.groupScale(d.categorical);
  }

  override getBarYQuantitative(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.quantitative);
  }

  override getBarWidthOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }

  override getBarHeightOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }
}
