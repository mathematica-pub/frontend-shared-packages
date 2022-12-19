import { Directive, Input } from '@angular/core';
import { FormatSpecifier, formatValue } from '../value-format/value-format';

@Directive()
export abstract class MapLegendContent {
  @Input() width: number;
  @Input() height: number;
  @Input() orientation: 'horizontal' | 'vertical';
  @Input() valuesSide: 'left' | 'right' | 'top' | 'bottom';
  @Input() scale: any;
  @Input() formatter: FormatSpecifier;
  @Input() outlineColor: string;
  values: any[];
  colors: string[];
  startValueSpace: number;
  endValueSpace: number;
  largerValueSpace: number;
  leftOffset: number;

  setValues(): void {
    let values;
    values = this.getValuesFromScale();
    if (this.orientation === 'vertical') {
      values = values.reverse();
    }
    this.setValueSpaces(values);
    if (this.formatter) {
      values = this.getFormattedValues(values);
    }
    this.values = values;
  }

  getFormattedValues(values: number[]): string[] {
    return values.map((d) => formatValue(d, this.formatter));
  }

  abstract getValuesFromScale(): number[];

  setValueSpaces(values: number[]): void {
    this.startValueSpace = values[0].toString().length * 4;
    this.endValueSpace = values[values.length - 1].toString().length * 4;
    this.largerValueSpace =
      this.startValueSpace > this.endValueSpace
        ? this.startValueSpace
        : this.endValueSpace;
    this.leftOffset = this.getLeftOffset(values);
  }

  abstract getLeftOffset(values?: number[]): number;
}
