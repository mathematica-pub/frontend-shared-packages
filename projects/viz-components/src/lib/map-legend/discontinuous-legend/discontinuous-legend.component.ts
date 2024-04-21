import { Component } from '@angular/core';
import { VicOrientation } from '../../core/types/layout';
import {
  VicAttributeDataDimensionConfig,
  VicNoBinsAttributeDataDimensionConfig,
  VicValuesBin,
} from '../../geographies/geographies-attribute-data';
import { MapLegendContent } from '../map-legend-content';

type DiscontinuousAttributeDataDimensionConfig<Datum> = Exclude<
  VicAttributeDataDimensionConfig<Datum>,
  VicNoBinsAttributeDataDimensionConfig<Datum>
>;

/**
 * @internal
 */
@Component({
  selector: 'vic-discontinuous-legend',
  templateUrl: './discontinuous-legend.component.html',
  styleUrls: ['./discontinuous-legend.component.scss'],
})
export class DiscontinuousLegendComponent<Datum> extends MapLegendContent<
  Datum,
  DiscontinuousAttributeDataDimensionConfig<Datum>
> {
  VicValuesBin = VicValuesBin;

  getValuesFromScale(): string[] | number[] {
    if (this.config.binType === VicValuesBin.categorical) {
      return this.config.domain;
    } else {
      return this.getQuantitativeValuesFromScale();
    }
  }

  getQuantitativeValuesFromScale(): number[] {
    const binColors = this.config.range;
    const values =
      this.config.binType === VicValuesBin.customBreaks
        ? this.config.breakValues
        : [
            ...new Set(
              binColors.map((colors) => this.scale.invertExtent(colors)).flat()
            ),
          ];
    return values;
  }

  getLeftOffset(values: number[]): number {
    if (this.orientation === VicOrientation.horizontal) {
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
