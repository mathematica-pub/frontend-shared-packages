import { Directive, Input, OnChanges } from '@angular/core';
import { VicOrientation, VicSide } from '../core/types/layout';
import {
  VicAttributeDataDimensionConfig,
  VicValuesBin,
} from '../geographies/geographies.config';
import { formatValue } from '../value-format/value-format';

@Directive()
export abstract class MapLegendContent<
  Datum,
  TAttributeDataConfig extends VicAttributeDataDimensionConfig<Datum>
> implements OnChanges
{
  @Input() width: number;
  @Input() height: number;
  @Input() orientation: keyof typeof VicOrientation;
  @Input() valuesSide: keyof typeof VicSide;
  @Input() scale: any;
  @Input() config: TAttributeDataConfig;
  @Input() outlineColor: string;
  values: any[];
  colors: string[];
  startValueSpace: number;
  endValueSpace: number;
  largerValueSpace: number;
  leftOffset: number;

  abstract getValuesFromScale(): number[];
  abstract getLeftOffset(values?: number[]): number;

  ngOnChanges(): void {
    this.setValues();
    this.setColors();
  }

  setValues(): void {
    let values;
    values = this.getValuesFromScale();
    if (this.orientation === VicOrientation.vertical) {
      values = values.slice().reverse();
    }
    this.setValueSpaces(values);
    if (this.config.valueFormat) {
      values = this.getFormattedValues(values);
    }
    this.values = values;
  }

  setColors(): void {
    this.colors = this.config.range;
    if (this.orientation === VicOrientation.vertical) {
      this.colors = this.colors.slice().reverse();
    }
  }

  getFormattedValues(values: number[]): string[] {
    return values.map((d) => formatValue(d, this.config.valueFormat));
  }

  setValueSpaces(values: number[]): void {
    if (this.config.binType !== VicValuesBin.categorical) {
      this.startValueSpace = values[0].toString().length * 4;
      this.endValueSpace = values[values.length - 1].toString().length * 4;
      this.largerValueSpace =
        this.startValueSpace > this.endValueSpace
          ? this.startValueSpace
          : this.endValueSpace;
      this.leftOffset = this.getLeftOffset(values);
    } else {
      this.startValueSpace = 0;
      this.endValueSpace = 0;
      this.largerValueSpace = 0;
      this.leftOffset = 0;
    }
  }
}
