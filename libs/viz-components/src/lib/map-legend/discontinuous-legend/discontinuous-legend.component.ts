import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Orientation } from '../../core/types/layout';
import { BinStrategy } from '../../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-enums';
import { VicAttributeDataDimensionConfig } from '../../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-types';
import { NoBinsAttributeDataDimension } from '../../geographies/config/layers/attribute-data-layer/dimensions/no-bins/no-bins';
import { MapLegend } from '../map-legend-base';

export type DiscontinuousAttributeDataDimensionConfig<Datum> = Exclude<
  VicAttributeDataDimensionConfig<Datum>,
  NoBinsAttributeDataDimension<Datum>
>;

/**
 * @internal
 */
@Component({
  selector: 'vic-discontinuous-legend',
  templateUrl: './discontinuous-legend.component.html',
  styleUrls: ['./discontinuous-legend.component.scss'],
  imports: [CommonModule],
})
export class DiscontinuousLegendComponent<Datum> extends MapLegend<
  Datum,
  DiscontinuousAttributeDataDimensionConfig<Datum>
> {
  getValuesFromScale(): string[] | number[] {
    if (this.config.binType === BinStrategy.categorical) {
      return this.config.getDomain();
    } else {
      return this.getQuantitativeValuesFromScale();
    }
  }

  getQuantitativeValuesFromScale(): number[] {
    const binColors = this.config.range;
    const values =
      this.config.binType === BinStrategy.customBreaks
        ? this.config.breakValues
        : [
            ...new Set(
              binColors.map((colors) => this.scale.invertExtent(colors)).flat()
            ),
          ];
    return values;
  }

  getLeftOffset(values: string[]): number {
    if (this.orientation === Orientation.horizontal) {
      const colorHalfWidth = this.width / (values.length * 2);
      if (colorHalfWidth > this.largerValueSpace) {
        return (colorHalfWidth - this.startValueSpace) * -1;
      } else {
        return (this.largerValueSpace - this.startValueSpace) * -1;
      }
    } else {
      return 0;
    }
  }
}
