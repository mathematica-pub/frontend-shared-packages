import { Component } from '@angular/core';
import { VicOrientation } from '../../core/types/layout';
import {
  VicAttributeDataDimensionConfig,
  VicNoBinsQuantitativeAttributeDataDimensionConfig,
  VicValuesBin,
} from '../../geographies/geographies.config';
import { MapLegendContent } from '../map-legend-content';

type DiscontinuousAttributeDataDimensionConfig<Datum> = Exclude<
  VicAttributeDataDimensionConfig<Datum>,
  VicNoBinsQuantitativeAttributeDataDimensionConfig<Datum>
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

  setCategoricalValues(): void {
    this.values = this.config.domain;
    this.startValueSpace = 0;
    this.endValueSpace = 0;
    this.largerValueSpace = 0;
    this.leftOffset = 0;
  }

  getValuesFromScale(): any[] {
    if (this.config.binType === VicValuesBin.categorical) {
      return this.config.domain;
    } else {
      const binColors = this.config.range;
      const values =
        this.config.binType === VicValuesBin.customBreaks
          ? this.config.breakValues
          : [
              ...new Set(
                binColors
                  .map((colors) => this.scale.invertExtent(colors))
                  .flat()
              ),
            ];
      return values;
    }
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
