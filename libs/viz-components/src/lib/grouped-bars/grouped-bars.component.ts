import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { scaleBand } from 'd3';
import { BarDatum, BarsComponent } from '../bars/bars.component';
import { DataValue } from '../core/types/values';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { GroupedBarsConfig } from './config/grouped-bars-config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-grouped-bars]',
  template: '',
  styleUrls: ['./grouped-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: GroupedBarsComponent },
  ],
  host: {
    '[class]': 'config.class',
    '[style.mixBlendMode]': 'config.mixBlendMode',
  },
})
export class GroupedBarsComponent<
  Datum,
  TOrdinalValue extends DataValue,
> extends BarsComponent<Datum, TOrdinalValue> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('config') override config: GroupedBarsConfig<Datum, TOrdinalValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupScale: any;

  override drawMarks(): void {
    this.setGroupScale();
    super.drawMarks();
  }

  setGroupScale(): void {
    if (this.config.dimensions.ordinal === 'x') {
      this.groupScale = scaleBand(this.config.color.calculatedDomain, [
        0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.scales.x as any).bandwidth(),
      ]).padding(this.config.intraGroupPadding);
    } else {
      this.groupScale = scaleBand(this.config.color.calculatedDomain, [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.scales.y as any).bandwidth(),
        0,
      ]).padding(this.config.intraGroupPadding);
    }
  }

  override getBarColor(d: BarDatum<TOrdinalValue>): string {
    return this.scales.color(d.color);
  }

  override getBarXOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.x(d.ordinal) + this.groupScale(d.color);
  }

  override getBarY(d: BarDatum<TOrdinalValue>): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarYQuantitative(d);
    } else {
      return this.getBarYOrdinal(d);
    }
  }

  override getBarYOrdinal(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.ordinal) + this.groupScale(d.color);
  }

  override getBarYQuantitative(d: BarDatum<TOrdinalValue>): number {
    return this.scales.y(d.quantitative);
  }

  override getBarWidthOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.groupScale as any).bandwidth();
  }

  override getBarHeightOrdinal(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.groupScale as any).bandwidth();
  }
}
