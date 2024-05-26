import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { scaleBand } from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { VicDataValue } from '../core/types/values';
import { VIC_DATA_MARKS } from '../data-marks/data-marks.token';
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

  override getBarColor(i: number): string {
    return this.scales.categorical(this.config.categorical.values[i]);
  }

  override getBarXOrdinal(i: number): number {
    return (
      this.scales.x(this.config.ordinal.values[i]) +
      this.groupScale(this.config.categorical.values[i])
    );
  }

  override getBarY(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarYQuantitative(i);
    } else {
      return this.getBarYOrdinal(i);
    }
  }

  getBarYOrdinal(i: number): number {
    return (
      this.scales.y(this.config[this.config.dimensions.y].values[i]) +
      this.groupScale(this.config.categorical.values[i])
    );
  }

  getBarYQuantitative(i: number): number {
    return this.scales.y(this.config[this.config.dimensions.y].values[i]);
  }

  override getBarWidthOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }

  override getBarHeightOrdinal(): number {
    return (this.groupScale as any).bandwidth();
  }
}
