import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import * as CSSType from 'csstype';
import { GeoPath, GeoProjection, geoPath, select } from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { isFunction, isPrimitiveType } from '../core/utilities/type-guards';
import { VIC_DATA_MARKS } from '../data-marks/data-marks';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { VicMapDataMarks } from '../map-data-marks/map-data-marks';
import { PatternUtilities } from '../shared/pattern-utilities';
import { VicGeographiesConfig } from './config/geographies.config';
import { VicGeographiesDataLayer } from './config/layers/data-layer';
import { VicGeographiesLabels } from './config/layers/geographies-labels';
import { VicGeographiesNoDataLayer } from './config/layers/no-data-layer';
import { VicGeographiesFeature } from './geographies-feature';

function isAttributeDataConfig<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon
>(
  config:
    | VicGeographiesDataLayer<Datum, TProperties, TGeometry>
    | VicGeographiesNoDataLayer<TProperties, TGeometry>
): config is VicGeographiesDataLayer<Datum, TProperties, TGeometry> {
  return config.hasAttributeData;
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
    { provide: VIC_DATA_MARKS, useExisting: GeographiesComponent },
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
> extends VicMapDataMarks<
  Datum,
  VicGeographiesConfig<Datum, TProperties, TGeometry>
> {
  projection: GeoProjection;
  path: GeoPath;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataGeographies$: Observable<any> = this.dataGeographies.asObservable();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noDataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  noDataGeographies$: Observable<any> = this.noDataGeographies.asObservable();

  constructor(public zone: NgZone, public elRef: ElementRef) {
    super();
  }

  override initFromConfig(): void {
    this.setPropertiesFromRanges();
    this.updateChartAttributeProperties();
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
        scale: this.config.dataLayer.attributeData.getScale(
          this.config.dataLayer.nullColor
        ),
        config: this.config.dataLayer.attributeData,
      });
    });
  }

  drawMarks(): void {
    const transitionDuration = this.getTransitionDuration();
    this.drawMap(transitionDuration);
    this.updateGeographyElements();
  }

  drawMap(transitionDuration): void {
    const t = select(this.chart.svgRef.nativeElement)
      .transition()
      .duration(transitionDuration);
    this.drawLayers(t);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drawLayers(t: any): void {
    const layersGroup = select(this.elRef.nativeElement)
      .append('g')
      .attr('class', 'vic-geographies-layers');

    [this.config.dataLayer, ...this.config.noDataLayers].forEach(
      (config, i) => {
        const layer = layersGroup
          .selectAll<
            SVGGElement,
            VicGeographiesFeature<TProperties, TGeometry>
          >(`.geographies-layer .geographies-layer-${i} ${config.class}`)
          .data<VicGeographiesFeature<TProperties, TGeometry>>(
            config.geographies
          )
          .join(
            (enter) =>
              enter
                .append('g')
                .attr(
                  'class',
                  `.geographies-layer .geographies-layer-${i} ${config.class}`
                ),
            (update) => update,
            (exit) => exit.remove()
          );

        layer
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
                  isAttributeDataConfig(config)
                    ? this.getFillFromAttributeData(d)
                    : this.getFillFromGeography(d, config)
                ),
            (update) =>
              update.call((update) =>
                update
                  .attr('d', this.path)
                  .attr('stroke', config.strokeColor)
                  .attr('stroke-width', config.strokeWidth)
                  .transition(t)
                  .attr('fill', (d) =>
                    isAttributeDataConfig(config)
                      ? this.getFillFromAttributeData(d)
                      : this.getFillFromGeography(d, config)
                  )
              ),
            (exit) => exit.remove()
          );

        if (config.labels) {
          layer
            .filter((d) =>
              config.labels.display(this.config.featureIndexAccessor(d))
            )
            .selectAll<
              SVGTextElement,
              VicGeographiesFeature<TProperties, TGeometry>
            >('.vic-geography-label')
            .data<VicGeographiesFeature<TProperties, TGeometry>>((d) => [d])
            .join(
              (enter) =>
                enter
                  .append('text')
                  .attr('class', 'vic-geography-label')
                  .attr('text-anchor', config.labels.textAnchor)
                  .attr('alignment-baseline', config.labels.alignmentBaseline)
                  .attr('dominant-baseline', config.labels.dominantBaseline)
                  .style('cursor', config.labels.cursor)
                  .attr('pointer-events', config.labels.pointerEvents)
                  .text((d) => config.labels.valueAccessor(d))
                  .attr('x', (d) => this.getLabelPosition(d, config.labels).x)
                  .attr('y', (d) => this.getLabelPosition(d, config.labels).y)
                  .attr('font-size', config.labels.fontScale(this.ranges.x[1]))
                  .attr('fill', (d) => this.getLabelColor(d, config))
                  .attr('font-weight', (d) =>
                    this.getLabelFontWeight(d, config)
                  ),
              (update) =>
                update.call((update) =>
                  update
                    .text((d) => config.labels.valueAccessor(d))
                    .attr('y', (d) => this.getLabelPosition(d, config.labels).y)
                    .attr('x', (d) => this.getLabelPosition(d, config.labels).x)
                    .attr(
                      'font-size',
                      config.labels.fontScale(this.ranges.x[1])
                    )
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .transition(t as any)
                    .attr('fill', (d) => this.getLabelColor(d, config))
                    .attr('font-weight', (d) =>
                      this.getLabelFontWeight(d, config)
                    )
                ),
              (exit) => exit.remove()
            );
        }
      }
    );
  }

  getFillFromAttributeData(
    geography: VicGeographiesFeature<TProperties, TGeometry>
  ): string {
    const geographyIndex = this.config.featureIndexAccessor(geography);
    return this.config.dataLayer.attributeData.fillPatterns
      ? this.getAttributePatternFill(geographyIndex)
      : this.getAttributeFill(geographyIndex);
  }

  getAttributeFill(geographyIndex: string | number): string {
    const dataValue =
      this.config.values.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeDataScale(dataValue);
  }

  getAttributePatternFill(geographyIndex: string | number): string {
    const datum = this.config.values.datumsByGeographyIndex.get(geographyIndex);
    const geographyFill = this.getAttributeFill(geographyIndex);
    const patterns = this.config.dataLayer.attributeData.fillPatterns;
    return PatternUtilities.getFill(datum, geographyFill, patterns);
  }

  getFillFromGeography(
    geography: VicGeographiesFeature<TProperties, TGeometry>,
    config: VicGeographiesNoDataLayer<TProperties, TGeometry>
  ): string {
    const featureIndex = this.config.featureIndexAccessor(geography);
    const defaultFill = config.categorical.getScale()(featureIndex);
    return config.categorical.fillPatterns
      ? PatternUtilities.getFill(
          geography,
          defaultFill,
          config.categorical.fillPatterns
        )
      : defaultFill;
  }

  getLabelPosition(
    d: VicGeographiesFeature<TProperties, TGeometry>,
    config:
      | VicGeographiesLabels<Datum, TProperties, TGeometry>
      | VicGeographiesLabels<
          VicGeographiesFeature<TProperties, TGeometry>,
          TProperties,
          TGeometry
        >
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return config.position(d, this.path, this.projection);
  }

  getLabelColor(
    geographyFeature: VicGeographiesFeature<TProperties, TGeometry>,
    config:
      | VicGeographiesDataLayer<Datum, TProperties, TGeometry>
      | VicGeographiesNoDataLayer<TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const geographyIndex = this.config.featureIndexAccessor(geographyFeature);
    const pathColor = isAttributeDataConfig(config)
      ? this.getFillFromAttributeData(geographyFeature)
      : this.getFillFromGeography(geographyFeature, config);
    let fontColor: CSSType.Property.Fill;
    if (isFunction<CSSType.Property.Fill>(config.labels.color)) {
      fontColor = config.labels.color(
        this.config.values.datumsByGeographyIndex.get(geographyIndex),
        pathColor
      );
    } else if (isPrimitiveType<CSSType.Property.Fill>(config.labels.color)) {
      fontColor = config.labels.color;
    }
    return fontColor;
  }

  getLabelFontWeight(
    geographyFeature: VicGeographiesFeature<TProperties, TGeometry>,
    config:
      | VicGeographiesDataLayer<Datum, TProperties, TGeometry>
      | VicGeographiesNoDataLayer<TProperties, TGeometry>
  ): CSSType.Property.FontWeight {
    const geographyIndex = this.config.featureIndexAccessor(geographyFeature);
    const pathColor = isAttributeDataConfig(config)
      ? this.getFillFromAttributeData(geographyFeature)
      : this.getFillFromGeography(geographyFeature, config);
    let fontProperty: CSSType.Property.FontWeight;
    if (isFunction<CSSType.Property.FontWeight>(config.labels.fontWeight)) {
      fontProperty = config.labels.fontWeight(
        this.config.values.datumsByGeographyIndex.get(geographyIndex),
        pathColor
      );
    } else if (
      isPrimitiveType<CSSType.Property.FontWeight>(config.labels.fontWeight)
    ) {
      fontProperty = config.labels.fontWeight;
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
