import { Component } from '@angular/core';
import { VicOrientation } from '../../core/types/layout';
import {
  VicAttributeDataDimensionConfig,
  VicValuesBin,
} from '../../geographies/config/dimensions/attribute-data-bin-types';
import { VicNoBinsAttributeDataDimension } from '../../geographies/config/dimensions/no-bins';
import { MapLegendContent } from '../map-legend-content';

type DiscontinuousAttributeDataDimensionConfig<Datum> = Exclude<
  VicAttributeDataDimensionConfig<Datum>,
  VicNoBinsAttributeDataDimension<Datum>
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
  getValuesFromScale(): string[] | number[] {
    if (this.config.binType === VicValuesBin.categorical) {
      return this.config.getDomain();
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
