import { Directive, Input, OnChanges, OnInit } from '@angular/core';
import { Orientation, Side } from '../core/types/layout';
import { ValueUtilities } from '../core/utilities/values';
import { BinStrategy } from '../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-enums';
import { VicAttributeDataDimensionConfig } from '../geographies/config/layers/attribute-data-layer/dimensions/attribute-data-bin-types';
import { CalculatedBinsAttributeDataDimension } from '../geographies/config/layers/attribute-data-layer/dimensions/calculated-bins/calculated-bins';

@Directive()
export abstract class MapLegend<
    Datum,
    AttributeDimensionConfig extends VicAttributeDataDimensionConfig<Datum>,
  >
  implements OnChanges, OnInit
{
  @Input() width: number;
  @Input() height: number;
  @Input() orientation: keyof typeof Orientation;
  @Input() valuesSide: keyof typeof Side;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() scale: any;
  @Input() config: AttributeDimensionConfig;
  @Input() outlineColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[];
  colors: string[];
  startValueSpace: number;
  endValueSpace: number;
  largerValueSpace: number;
  leftOffset: number;
  VicValuesBin: typeof BinStrategy;

  abstract getValuesFromScale(): string[] | number[];
  abstract getLeftOffset(values?: number[]): number;

  ngOnChanges(): void {
    this.setValues();
    this.setColors();
  }

  ngOnInit(): void {
    this.VicValuesBin = BinStrategy;
  }

  setValues(): void {
    if (this.config.binType !== BinStrategy.categorical) {
      this.setQuantitativeValues();
    } else {
      this.setCategoricalValues();
    }
  }

  setQuantitativeValues(): void {
    let values = this.getValuesFromScale() as number[];
    console.log(values);
    if (this.orientation === Orientation.vertical) {
      values = values.slice().reverse();
    }
    this.values = values.map((d) =>
      ValueUtilities.d3Format(
        d,
        (this.config as CalculatedBinsAttributeDataDimension<Datum>)
          .formatSpecifier
      )
    );
    this.setQuantitativeValueSpaces(this.values);
  }

  setCategoricalValues(): void {
    let values = this.getValuesFromScale() as string[];
    if (this.orientation === Orientation.vertical) {
      values = values.slice().reverse();
    }
    this.setCategoricalValueSpaces();
    this.values = values;
  }

  setColors(): void {
    this.colors = this.config.range;
    if (this.orientation === Orientation.vertical) {
      this.colors = this.colors.slice().reverse();
    }
  }

  setQuantitativeValueSpaces(values: number[]): void {
    console.log(values);
    this.startValueSpace = values[0].toString().length * 4;
    this.endValueSpace = values[values.length - 1].toString().length * 4;
    console.log('start value space', this.startValueSpace);
    console.log('end value space', this.endValueSpace);
    this.largerValueSpace =
      this.startValueSpace > this.endValueSpace
        ? this.startValueSpace
        : this.endValueSpace;
    console.log('larger value space', this.largerValueSpace);
    this.leftOffset = this.getLeftOffset(values);
  }

  setCategoricalValueSpaces(): void {
    this.startValueSpace = 0;
    this.endValueSpace = 0;
    this.largerValueSpace = 0;
    this.leftOffset = 0;
  }
}
