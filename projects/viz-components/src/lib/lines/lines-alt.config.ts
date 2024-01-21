import {
  InternSet,
  curveLinear,
  extent,
  group,
  map,
  max,
  min,
  range,
  scaleLinear,
  scaleOrdinal,
  scaleUtc,
  schemeTableau10,
} from 'd3';
import { isDate } from '../core/utilities/isDate';
import {
  VicCategoricalColorDimensionConfig,
  VicDomainPaddingConfig,
  VicQuantitativeDimensionConfig,
} from '../data-marks/data-dimension.config';
import { VicFormatSpecifier } from '../value-format/value-format';
import { XyDataMarksValues } from '../xy-data-marks/xy-data-marks';
import { Marker } from './lines.component';
import {
  VicLinesStrokeConfig,
  VicPointMarkerConfig,
  VicPointMarkersConfig,
} from './lines.config';

export class VicLinesAltConfig<T> {
  x: VicQuantitativeDimensionConfig<T>;
  y: VicQuantitativeDimensionConfig<T>;
  category: VicCategoricalColorDimensionConfig<T>;
  valueIsDefined?: (...args: any) => any;
  curve: (x: any) => any;
  pointMarkers: VicPointMarkersConfig;
  hoverDot: VicPointMarkerConfig;
  stroke: VicLinesStrokeConfig;
  labelLines?: boolean;
  lineLabelsFormat?: (d: string) => string;
  pointerDetectionRadius: number;
  mixBlendMode: string;

  constructor(init?: Partial<VicLinesAltConfig<T>>) {
    this.x = new VicQuantitativeDimensionConfig();
    this.y = new VicQuantitativeDimensionConfig();
    this.category = new VicCategoricalColorDimensionConfig();
    this.pointMarkers = new VicPointMarkersConfig();
    this.hoverDot = new VicPointMarkerConfig();
    this.stroke = new VicLinesStrokeConfig();
    this.x.scaleType = scaleUtc;
    this.y.scaleType = scaleLinear;
    this.category.valueAccessor = () => 1;
    this.category.colors = schemeTableau10 as string[];
    this.curve = curveLinear;
    this.lineLabelsFormat = (d: string) => d;
    this.pointerDetectionRadius = 80;
    this.hoverDot.radius = 4;
    Object.assign(this, init);
  }
}

export type VicLinesConfigNoDimensions<T> = Omit<
  VicLinesAltConfig<T>,
  'x' | 'y' | 'category'
>;

export class VicLinesConfigBuilder<T> extends VicLinesAltConfig<T> {
  _data: T[];
  values: XyDataMarksValues = new XyDataMarksValues();
  unpaddedDomain: {
    x: [any, any];
    y: [any, any];
  } = { x: undefined, y: undefined };
  linesD3Data;
  markersD3Data;
  canBeDrawnByPath: (x: number | Date) => boolean = (x) => {
    return (
      (typeof x === 'number' || isDate(x)) && x !== null && x !== undefined
    );
  };

  create(config?: VicLinesAltConfig<T>): this {
    Object.assign(this, config);
    this.x = config.x;
    this.y = config.y;
    this.category = config.category;
    return this;
  }

  updateValueAccessor(
    dimension: 'x' | 'y' | 'category',
    value: (...args: any) => any
  ): this {
    this[dimension].valueAccessor = value;
    return this.update();
  }

  updateDomain(dimension: 'x' | 'y', value: [any, any]): this {
    this[dimension].domain = value;
    return this.update();
  }

  updateValueFormat(dimension: 'x' | 'y', value: VicFormatSpecifier): this {
    this[dimension].valueFormat = value;
    return this.update();
  }

  updateScaleType(dimension: 'x' | 'y', value: (d: any, r: any) => any): this {
    this[dimension].scaleType = value;
    return this.update();
  }

  setDomainPadding(dimension: 'x' | 'y', value: VicDomainPaddingConfig): this {
    this[dimension].domainPadding = value;
    return this;
  }

  updateColorScale(value: (d: string | number | Date) => string): this {
    this.category.colorScale = value;
    return this.update();
  }

  updateColors(value: string[]): this {
    this.category.colors = value;
    return this.update();
  }

  private update(): this {
    if (this._data) {
      this.data(this._data);
    }
    return this;
  }

  setValueIsDefined(value: (...args: any) => any): this {
    this.valueIsDefined = value;
    return this;
  }

  setCurve(value: (x: any) => any): this {
    this.curve = value;
    return this;
  }

  setPointMarkers(value: Partial<VicPointMarkersConfig>): this {
    Object.assign(this.pointMarkers, value);
    return this;
  }

  setHoverDot(value: Partial<VicPointMarkerConfig>): this {
    Object.assign(this.hoverDot, value);
    return this;
  }

  setStroke(value: Partial<VicLinesStrokeConfig>): this {
    Object.assign(this.stroke, value);
    return this;
  }

  setLabelLines(value: boolean): this {
    this.labelLines = value;
    return this;
  }

  setLineLabelsFormat(value: (d: string) => string): this {
    this.lineLabelsFormat = value;
    return this;
  }

  setPointerDetectionRadius(value: number): this {
    this.pointerDetectionRadius = value;
    return this;
  }

  setMixBlendMode(value: string): this {
    this.mixBlendMode = value;
    return this;
  }

  data(data: T[]): this {
    this._data = data;
    this.setValueArrays();
    this.initDomains();
    this.setValueIndicies();
    this.initCategoryScale();
    this.setLinesD3Data();
    this.setMarkersD3Data();
    return this;
  }

  private setValueArrays(): void {
    this.values.x = map(this._data, this.x.valueAccessor);
    this.values.y = map(this._data, this.y.valueAccessor);
    this.values.category = map(this._data, this.category.valueAccessor);
  }

  private initDomains(): void {
    this.setUnpaddedDomains();
    if (this.category.domain === undefined) {
      this.category.domain = this.values.category;
    }
  }

  private setUnpaddedDomains(): void {
    this.unpaddedDomain.x =
      this.x.domain === undefined ? extent(this.values.x) : this.x.domain;
    this.unpaddedDomain.y =
      this.y.domain === undefined
        ? [min([min(this.values.y), 0]), max(this.values.y)]
        : this.y.domain;
  }

  private setValueIndicies(): void {
    const domainInternSet = new InternSet(this.category.domain);
    this.values.indicies = range(this.values.x.length).filter((i) =>
      domainInternSet.has(this.values.category[i])
    );
  }

  private initCategoryScale(): void {
    if (this.category.colorScale === undefined) {
      this.category.colorScale = scaleOrdinal(
        new InternSet(this.category.domain),
        this.category.colors
      );
    }
  }

  private setLinesD3Data(): void {
    const definedIndices = this.values.indicies.filter(
      (i) =>
        this.canBeDrawnByPath(this.values.x[i]) &&
        this.canBeDrawnByPath(this.values.y[i])
    );
    this.linesD3Data = group(definedIndices, (i) => this.values.category[i]);
  }

  private setMarkersD3Data(): void {
    this.markersD3Data = this.values.indicies
      .map((i) => {
        return { key: this.getMarkerKey(i), index: i };
      })
      .filter(
        (marker: Marker) =>
          this.canBeDrawnByPath(this.values.x[marker.index]) &&
          this.canBeDrawnByPath(this.values.y[marker.index])
      );
  }

  private getMarkerKey(i: number): string {
    return `${this.values.category[i]}-${this.values.x[i]}`;
  }
}
