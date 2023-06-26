import { Component, Input, OnChanges } from '@angular/core';
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
    this.colors = this.scale.range();
    this.values = this.scale.domain();
    this.startValueSpace = 0;
    this.endValueSpace = 0;
    this.largerValueSpace = 0;
    this.leftOffset = 0;
  }

  getValuesFromScale(): any[] {
    const binColors = this.scale.range();
    return [
      ...new Set(
        binColors.map((colors) => this.scale.invertExtent(colors)).flat()
      ),
    ];
  }

  setColors(): void {
    this.colors = this.scale.range();
    if (this.orientation === 'vertical') {
      this.colors = this.colors.reverse();
    }
  }

  getLeftOffset(values: number[]): number {
    if (this.orientation === 'horizontal') {
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
