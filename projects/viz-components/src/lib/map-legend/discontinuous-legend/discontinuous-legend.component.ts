import { Component, Input, OnChanges } from '@angular/core';
import { VicOrientation } from '../../core/types/orientation';
import { MapLegendContent } from '../map-legend-content';

/**
 * @internal
 */
@Component({
  selector: 'vic-discontinuous-legend',
  templateUrl: './discontinuous-legend.component.html',
  styleUrls: ['./discontinuous-legend.component.scss'],
})
export class DiscontinuousLegendComponent
  extends MapLegendContent
  implements OnChanges
{
  @Input() isCategorical: boolean;

  ngOnChanges() {
    if (this.isCategorical) {
      this.setCategoricalValues();
    } else {
      this.setValues();
      this.setColors();
    }
  }

  setCategoricalValues(): void {
    this.colors = this.config.range;
    this.values = this.config.domain;
    this.startValueSpace = 0;
    this.endValueSpace = 0;
    this.largerValueSpace = 0;
    this.leftOffset = 0;
  }

  getValuesFromScale(): any[] {
    const binColors = this.config.range;
    const values = this.config.breakValues ?? [
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
