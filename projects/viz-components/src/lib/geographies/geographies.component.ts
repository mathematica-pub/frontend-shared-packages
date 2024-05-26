import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import * as CSSType from 'csstype';
import { GeoPath, GeoProjection, Selection, geoPath, select } from 'd3';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../chart/chart.component';
import { isFunction, isPrimitiveType } from '../core/utilities/type-guards';
import { VIC_DATA_MARKS } from '../data-marks/data-marks.token';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { VicMapDataMarks } from '../map-data-marks/map-data-marks';
import { PatternUtilities } from '../shared/pattern-utilities.class';
import { VicDataGeographies } from './config/dimensions/data-geographies';
import { VicNoDataGeographies } from './config/dimensions/no-data-geographies';
import { VicGeographiesLabels } from './config/geographies-labels';
import { VicGeographiesConfig } from './config/geographies.config';
import { VicGeographiesFeature } from './geographies-feature';

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
  dataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
  dataGeographies$: Observable<any> = this.dataGeographies.asObservable();
  noDataGeographies: BehaviorSubject<any> = new BehaviorSubject(null);
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
        scale: this.config.dataGeographies.attributeData.getScale(
          this.config.dataGeographies.nullColor
        ),
        config: this.config.dataGeographies.attributeData,
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

    if (this.config.dataGeographies) {
      this.drawDataLayer(t);
    }
    if (this.config.noDataGeographies) {
      this.drawNoDataLayers(t);
    }
  }

  drawDataLayer(t: any): void {
    const dataLayers = select(this.elRef.nativeElement)
      .selectAll<
        SVGGElement,
        VicDataGeographies<Datum, TProperties, TGeometry>
      >('.vic-map-layer.vic-data')
      .data<VicDataGeographies<Datum, TProperties, TGeometry>>([
        this.config.dataGeographies,
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
            .attr('stroke', this.config.dataGeographies.strokeColor)
            .attr('stroke-width', this.config.dataGeographies.strokeWidth)
            .attr('fill', (d) =>
              this.config.dataGeographies.attributeData.fillPatterns
                ? this.getPatternFill(
                    this.config.dataGeographies.featureIndexAccessor(d)
                  )
                : this.getFill(
                    this.config.dataGeographies.featureIndexAccessor(d)
                  )
            ),
        (update) =>
          update.call((update) =>
            update
              .attr('d', this.path)
              .attr('stroke', this.config.dataGeographies.strokeColor)
              .attr('stroke-width', this.config.dataGeographies.strokeWidth)
              .transition(t)
              .attr('fill', (d) =>
                this.config.dataGeographies.attributeData.fillPatterns
                  ? this.getPatternFill(
                      this.config.dataGeographies.featureIndexAccessor(d)
                    )
                  : this.getFill(
                      this.config.dataGeographies.featureIndexAccessor(d)
                    )
              )
          ),
        (exit) => exit.remove()
      );

    if (this.config.dataGeographies.labels) {
      this.drawLabels(
        dataGeographyGroups,
        t,
        this.config.dataGeographies.labels
      );
    }
  }

  drawNoDataLayers(t: any): void {
    const noDataLayers = select(this.elRef.nativeElement)
      .selectAll<
        SVGGElement,
        VicNoDataGeographies<Datum, TProperties, TGeometry>
      >('.vic-map-layer.vic-no-data')
      .data<VicNoDataGeographies<Datum, TProperties, TGeometry>>(
        this.config.noDataGeographies
      )
      .join(
        (enter) => enter.append('g').attr('class', 'vic-map-layer vic-no-data'),
        (update) => update,
        (exit) => exit.remove()
      );

    this.config.noDataGeographies.forEach((config, index) => {
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
      this.config.values.attributeValuesByGeographyIndex.get(geographyIndex);
    return this.attributeDataScale(dataValue);
  }

  getPatternFill(geographyIndex: string | number): string {
    const datum = this.config.values.datumsByGeographyIndex.get(geographyIndex);
    const color = this.attributeDataScale(
      this.config.values.attributeValuesByGeographyIndex.get(geographyIndex)
    );
    const predicates = this.config.dataGeographies.attributeData.fillPatterns;
    return PatternUtilities.getPatternFill(datum, color, predicates);
  }

  getNoDataGeographyPatternFill(
    geography: VicGeographiesFeature<TProperties, TGeometry>,
    config: VicNoDataGeographies<Datum, TProperties, TGeometry>
  ): string {
    return PatternUtilities.getPatternFill(
      geography,
      config.fill,
      config.fillPatterns
    );
  }

  drawLabels(
    features: Selection<
      SVGGElement,
      VicGeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      | VicNoDataGeographies<Datum, TProperties, TGeometry>
      | VicDataGeographies<Datum, TProperties, TGeometry>
    >,
    t: any,
    labelsConfig: VicGeographiesLabels<Datum, TProperties, TGeometry>
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
                this.config.dataGeographies.featureIndexAccessor(d),
                labelsConfig
              )
            )
            .attr('font-weight', (d) =>
              this.getLabelFontWeight(
                this.config.dataGeographies.featureIndexAccessor(d),
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
                  this.config.dataGeographies.featureIndexAccessor(d),
                  labelsConfig
                )
              )
              .attr('font-weight', (d) =>
                this.getLabelFontWeight(
                  this.config.dataGeographies.featureIndexAccessor(d),
                  labelsConfig
                )
              )
          ),
        (exit) => exit.remove()
      );
  }

  getLabelPosition(
    d: VicGeographiesFeature<TProperties, TGeometry>,
    config: VicGeographiesLabels<Datum, TProperties, TGeometry>
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return config.position(d, this.path, this.projection);
  }

  getLabelColor(
    geographyIndex: string | number,
    config: VicGeographiesLabels<Datum, TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const pathColor = this.getFill(geographyIndex);
    let fontColor: CSSType.Property.Fill;
    if (isFunction<CSSType.Property.Fill>(config.color)) {
      fontColor = config.color(
        this.config.values.datumsByGeographyIndex.get(geographyIndex),
        pathColor
      );
    } else if (isPrimitiveType<CSSType.Property.Fill>(config.color)) {
      fontColor = config.color;
    }
    return fontColor;
  }

  getLabelFontWeight(
    geographyIndex: string | number,
    config: VicGeographiesLabels<Datum, TProperties, TGeometry>
  ): CSSType.Property.FontWeight {
    const pathColor = this.getFill(geographyIndex);
    let fontProperty: CSSType.Property.FontWeight;
    if (isFunction<CSSType.Property.FontWeight>(config.fontWeight)) {
      fontProperty = config.fontWeight(
        this.config.values.datumsByGeographyIndex.get(geographyIndex),
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
