import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import * as CSSType from 'csstype';
import { InternMap, Selection, geoPath, select } from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { isFunction, isPrimitiveType } from '../core/utilities/type-guards';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { MapDataMarksBase } from '../map-data-marks/map-data-marks-base';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { VicDataGeographyConfig } from './dimensions/data-geographies';
import { VicNoDataGeographyConfig } from './dimensions/no-data-geographies';
import { VicGeographiesFeature } from './geographies';
import { VicGeographyLabelConfig } from './geographies-labels';
import { VicGeographiesConfig } from './geographies.config';

export class MapDataValues {
  attributeValuesByGeographyIndex: InternMap;
  datumsByGeographyIndex: InternMap;
}

export const GEOGRAPHIES = new InjectionToken<
  GeographiesComponent<unknown, unknown>
>('GeographiesComponent');
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-geographies]',
  templateUrl: './geographies.component.html',
  styleUrls: ['./geographies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DATA_MARKS, useExisting: GeographiesComponent },
    {
      provide: GEOGRAPHIES,
      useExisting: GeographiesComponent,
    },
    {
      provide: ChartComponent,
      useExisting: MapChartComponent,
    },
  ],
})
export class GeographiesComponent<
  Datum,
  TProperties extends GeoJsonProperties = GeoJsonProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
> extends MapDataMarksBase<
  Datum,
  VicGeographiesConfig<Datum, TProperties, TGeometry>
> {
  projection: any;
  path: any;
  values: MapDataValues = new MapDataValues();
  dataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  dataGeographies$: Observable<any> = this.dataGeographies.asObservable();
  noDataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  noDataGeographies$: Observable<any> = this.noDataGeographies.asObservable();

  constructor(public zone: NgZone, public elRef: ElementRef) {
    super();
  }

  override initFromConfig(): void {
    this.setPropertiesFromRanges();
    this.setPropertiesFromConfig();
  }

  setPropertiesFromConfig(): void {
    this.setValueArrays();
    this.initAttributeDataProperties();
    this.updateChartAttributeProperties();
  }

  setValueArrays(): void {
    const uniqueByGeoAccessor = (arr: any[], set = new Set()) =>
      arr.filter(
        (x) =>
          !set.has(
            this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(x)
          ) &&
          set.add(
            this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(x)
          )
      );
    const uniqueDatums = uniqueByGeoAccessor(this.config.data);
    this.values.attributeValuesByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        const value =
          this.config.dataGeographyConfig.attributeDataConfig.valueAccessor(d);
        return [
          this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(d),
          value === null || value === undefined ? NaN : value,
        ];
      })
    );
    this.values.datumsByGeographyIndex = new InternMap(
      uniqueDatums.map((d) => {
        return [
          this.config.dataGeographyConfig.attributeDataConfig.geoAccessor(d),
          d,
        ];
      })
    );
  }

  initAttributeDataProperties(): void {
    this.attributeDataConfig.setPropertiesFromData(
      Array.from(this.values.attributeValuesByGeographyIndex.values())
    );
  }

  setPropertiesFromRanges(): void {
    this.setProjection();
    this.setPath();
  }

  setProjection(): void {
    this.projection = this.config.projection.fitSize(
      [this.ranges.x[1], this.ranges.y[0]],
      this.config.boundary
    );
  }

  setPath(): void {
    this.path = geoPath().projection(this.projection);
  }

  updateChartAttributeProperties(): void {
    this.zone.run(() => {
      this.chart.updateAttributeProperties({
        scale: this.config.dataGeographyConfig.attributeDataConfig.getScale(
          this.config.dataGeographyConfig.nullColor
        ),
        config: this.config.dataGeographyConfig.attributeDataConfig,
      });
    });
  }

  resizeMarks(): void {
    this.setPropertiesFromRanges();
    this.drawMarks();
  }

  drawMarks(): void {
    this.drawMap(this.chart.transitionDuration);
    this.updateGeographyElements();
  }

  drawMap(transitionDuration): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration);

    if (this.config.dataGeographyConfig) {
      this.drawDataLayer(t);
    }
    if (this.config.noDataGeographiesConfigs) {
      this.drawNoDataLayers(t);
    }
  }

  drawDataLayer(t: any): void {
    const dataLayers = select(this.elRef.nativeElement)
      .selectAll<
        SVGGElement,
        VicDataGeographyConfig<Datum, TProperties, TGeometry>
      >('.vic-map-layer.vic-data')
      .data<VicDataGeographyConfig<Datum, TProperties, TGeometry>>([
        this.config.dataGeographyConfig,
      ])
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    const dataGeographyGroups = dataLayers
      .selectAll<SVGGElement, VicGeographiesFeature<TProperties, TGeometry>>(
        '.geography-g'
      )
      .data<VicGeographiesFeature<TProperties, TGeometry>>(
        (layer) => layer.geographies
      )
      .join(
        (enter) => enter.append('g').attr('class', 'geography-g'),
        (update) => update,
        (exit) => exit.remove()
      );

    dataGeographyGroups
      .selectAll<SVGPathElement, VicGeographiesFeature<TProperties, TGeometry>>(
        'path'
      )
      .data<VicGeographiesFeature<TProperties, TGeometry>>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', this.path)
            .attr('stroke', this.config.dataGeographyConfig.strokeColor)
            .attr('stroke-width', this.config.dataGeographyConfig.strokeWidth)
            .attr('fill', (d) =>
              this.config.dataGeographyConfig.attributeDataConfig
                .patternPredicates
                ? this.getPatternFill(this.config.featureIndexAccessor(d))
                : this.getFill(this.config.featureIndexAccessor(d))
            ),
        (update) =>
          update.call((update) =>
            update
              .attr('d', this.path)
              .attr('stroke', this.config.dataGeographyConfig.strokeColor)
              .attr('stroke-width', this.config.dataGeographyConfig.strokeWidth)
              .transition(t)
              .attr('fill', (d) =>
                this.config.dataGeographyConfig.attributeDataConfig
                  .patternPredicates
                  ? this.getPatternFill(this.config.featureIndexAccessor(d))
                  : this.getFill(this.config.featureIndexAccessor(d))
              )
          ),
        (exit) => exit.remove()
      );

    if (this.config.dataGeographyConfig.labels) {
      this.drawLabels(
        dataGeographyGroups,
        t,
        this.config.dataGeographyConfig.labels
      );
    }
  }

  drawNoDataLayers(t: any): void {
    const noDataLayers = select(this.elRef.nativeElement)
      .selectAll<
        SVGGElement,
        VicNoDataGeographyConfig<Datum, TProperties, TGeometry>
      >('.vic-map-layer.vic-no-data')
      .data<VicNoDataGeographyConfig<Datum, TProperties, TGeometry>>(
        this.config.noDataGeographiesConfigs
      )
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-no-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    this.config.noDataGeographiesConfigs.forEach((config, index) => {
      const noDataGeographyGroups = noDataLayers
        .filter((d, i) => i === index)
        .selectAll<SVGGElement, VicGeographiesFeature<TProperties, TGeometry>>(
          '.no-data-geography-g'
        )
        .data<VicGeographiesFeature<TProperties, TGeometry>>(
          (layer) => layer.geographies
        )
        .join(
          (enter) => enter.append('g').attr('class', 'no-data-geography-g'),
          (update) => update,
          (exit) => exit.remove()
        );

      noDataGeographyGroups
        .selectAll<
          SVGPathElement,
          VicGeographiesFeature<TProperties, TGeometry>
        >('path')
        .data<VicGeographiesFeature<TProperties, TGeometry>>((d) => [d])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('d', this.path)
              .attr('stroke', config.strokeColor)
              .attr('stroke-width', config.strokeWidth)
              .attr('fill', (d) =>
                this.getNoDataGeographyPatternFill(d, config)
              ),
          (update) =>
            update
              .attr('d', this.path)
              .attr('fill', (d) =>
                this.getNoDataGeographyPatternFill(d, config)
              ),
          (exit) => exit.remove()
        );

      if (config.labels) {
        this.drawLabels(noDataGeographyGroups, t, config.labels);
      }
    });
  }

  getFill(geographyIndex: string | number): string {
    const dataValue =
      this.values.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeDataScale(dataValue);
  }

  getPatternFill(geographyIndex: string | number): string {
    const datum = this.values.datumsByGeographyIndex.get(geographyIndex);
    const color = this.attributeDataScale(
      this.values.attributeValuesByGeographyIndex.get(geographyIndex)
    );
    const predicates =
      this.config.dataGeographyConfig.attributeDataConfig.patternPredicates;
    return PatternUtilities.getPatternFill(datum, color, predicates);
  }

  getNoDataGeographyPatternFill(
    geography: VicGeographiesFeature<TProperties, TGeometry>,
    config: VicNoDataGeographyConfig<Datum, TProperties, TGeometry>
  ): string {
    return PatternUtilities.getPatternFill(
      geography,
      config.fill,
      config.patternPredicates
    );
  }

  drawLabels(
    features: Selection<
      SVGGElement,
      VicGeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      | VicNoDataGeographyConfig<Datum, TProperties, TGeometry>
      | VicDataGeographyConfig<Datum, TProperties, TGeometry>
    >,
    t: any,
    labelsConfig: VicGeographyLabelConfig<Datum, TProperties, TGeometry>
  ): void {
    features
      .filter((d, i) => labelsConfig.display(d))
      .selectAll('.vic-geography-label')
      .remove();

    features
      .filter((d) => labelsConfig.display(d))
      .selectAll<SVGTextElement, VicGeographiesFeature<TProperties, TGeometry>>(
        '.vic-geography-label'
      )
      .data<VicGeographiesFeature<TProperties, TGeometry>>((d) => [d])
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('class', 'vic-geography-label')
            .attr('text-anchor', labelsConfig.textAnchor)
            .attr('alignment-baseline', labelsConfig.alignmentBaseline)
            .attr('dominant-baseline', labelsConfig.dominantBaseline)
            .style('cursor', labelsConfig.cursor)
            .attr('pointer-events', labelsConfig.pointerEvents)
            .text((d) => labelsConfig.valueAccessor(d))
            .attr('x', (d) => this.getLabelPosition(d, labelsConfig).x)
            .attr('y', (d) => this.getLabelPosition(d, labelsConfig).y)
            .attr('font-size', labelsConfig.fontScale(this.ranges.x[1]))
            .attr('fill', (d) =>
              this.getLabelColor(
                this.config.featureIndexAccessor(d),
                labelsConfig
              )
            )
            .attr('font-weight', (d) =>
              this.getLabelFontWeight(
                this.config.featureIndexAccessor(d),
                labelsConfig
              )
            ),
        (update) =>
          update.call((update) =>
            update
              .text((d) => labelsConfig.valueAccessor(d))
              .attr('y', (d) => this.getLabelPosition(d, labelsConfig).y)
              .attr('x', (d) => this.getLabelPosition(d, labelsConfig).x)
              .attr('font-size', labelsConfig.fontScale(this.ranges.x[1]))
              .transition(t as any)
              .attr('fill', (d) =>
                this.getLabelColor(
                  this.config.featureIndexAccessor(d),
                  labelsConfig
                )
              )
              .attr('font-weight', (d) =>
                this.getLabelFontWeight(
                  this.config.featureIndexAccessor(d),
                  labelsConfig
                )
              )
          ),
        (exit) => exit.remove()
      );
  }

  getLabelPosition(
    d: VicGeographiesFeature<TProperties, TGeometry>,
    config: VicGeographyLabelConfig<Datum, TProperties, TGeometry>
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return config.position(d, this.path, this.projection);
  }

  getLabelColor(
    geographyIndex: string | number,
    config: VicGeographyLabelConfig<Datum, TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const pathColor = this.getFill(geographyIndex);
    let fontColor: CSSType.Property.Fill;
    if (isFunction<CSSType.Property.Fill>(config.color)) {
      fontColor = config.color(
        this.values.datumsByGeographyIndex.get(geographyIndex),
        pathColor
      );
    } else if (isPrimitiveType<CSSType.Property.Fill>(config.color)) {
      fontColor = config.color;
    }
    return fontColor;
  }

  getLabelFontWeight(
    geographyIndex: string | number,
    config: VicGeographyLabelConfig<Datum, TProperties, TGeometry>
  ): CSSType.Property.FontWeight {
    const pathColor = this.getFill(geographyIndex);
    let fontProperty: CSSType.Property.FontWeight;
    if (isFunction<CSSType.Property.FontWeight>(config.fontWeight)) {
      fontProperty = config.fontWeight(
        this.values.datumsByGeographyIndex.get(geographyIndex),
        pathColor
      );
    } else if (
      isPrimitiveType<CSSType.Property.FontWeight>(config.fontWeight)
    ) {
      fontProperty = config.fontWeight;
    }
    return fontProperty;
  }

  updateGeographyElements(): void {
    const dataGeographies = select(this.elRef.nativeElement)
      .selectAll('.vic-map-layer.vic-data')
      .selectAll('path');
    const noDataGeographies = select(this.elRef.nativeElement)
      .selectAll('vic-map-layer.vic-no-data')
      .selectAll('path');
    this.dataGeographies.next(dataGeographies);
    this.noDataGeographies.next(noDataGeographies);
  }
}
