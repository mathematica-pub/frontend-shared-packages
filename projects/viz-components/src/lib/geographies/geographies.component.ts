import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { GeoPath, GeoProjection, geoPath, select } from 'd3';
import { Selection } from 'd3-selection';
import { GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartComponent } from '../charts/chart/chart.component';
import { MapChartComponent } from '../charts/map-chart/map-chart.component';
import { VicMapPrimaryMarks } from '../marks/map-marks/map-primary-marks/map-primary-marks';
import { VIC_PRIMARY_MARKS } from '../marks/primary-marks/primary-marks';
import { GeographiesConfig } from './config/geographies-config';
import { GeographiesAttributeDataLayer } from './config/layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from './config/layers/geojson-properties-layer/geojson-properties-layer';
import { GeographiesLabels } from './config/layers/labels/geographies-labels';
import { GeographiesFeature } from './geographies-feature';

export type LayersGroup = Selection<SVGGElement, unknown, null, undefined>;

export const GEOGRAPHIES = new InjectionToken<
  GeographiesComponent<unknown, unknown>
>('GeographiesComponent');
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-primary-marks-geographies]',
  templateUrl: './geographies.component.html',
  styleUrls: ['./geographies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIC_PRIMARY_MARKS, useExisting: GeographiesComponent },
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
  TGeometry extends Geometry = MultiPolygon | Polygon,
> extends VicMapPrimaryMarks<
  Datum,
  GeographiesConfig<Datum, TProperties, TGeometry>
> {
  projection: GeoProjection;
  path: GeoPath;
  pathsByLayer: BehaviorSubject<
    Selection<
      SVGPathElement,
      GeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      GeographiesFeature<TProperties, TGeometry>
    >[]
  > = new BehaviorSubject(null);
  pathsByLayer$: Observable<
    Selection<
      SVGPathElement,
      GeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      GeographiesFeature<TProperties, TGeometry>
    >[]
  > = this.pathsByLayer.asObservable();
  formatForClassName = (s: string): string => s.replace(/\s/g, '-');

  constructor(
    public zone: NgZone,
    public elRef: ElementRef
  ) {
    super();
  }

  override initFromConfig(): void {
    this.setChartScalesFromRanges();
    if (this.config.attributeDataLayer) {
      this.updateChartAttributeProperties();
    } else {
      this.drawMarks();
    }
  }

  setChartScalesFromRanges(): void {
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
        scale: this.config.attributeDataLayer.attributeDimension.getScale(),
        config: this.config.attributeDataLayer.attributeDimension,
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
    const layerGroup = select(this.elRef.nativeElement)
      .selectAll<
        SVGGElement,
        | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
        | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>
      >('.vic-geographies-layer')
      .data<
        | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
        | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>
      >(this.config.layers, (layer) => layer.id)
      .join(
        (enter) =>
          enter
            .append('g')
            .attr(
              'class',
              (d) => `vic-geographies-layer layer-${d.id} ${d.class ?? ''}`
            ),
        (update) => update,
        (exit) => exit.remove()
      );

    this.config.layers.forEach((layer) => {
      const geographyGroup = layerGroup
        .filter((d) => d.id === layer.id)
        .selectAll<SVGGElement, GeographiesFeature<TProperties, TGeometry>>(
          `.vic-geography-g`
        )
        .data<GeographiesFeature<TProperties, TGeometry>>(
          (d) => d.geographies,
          (d) => this.config.featureIndexAccessor(d)
        )
        .join('g')
        .attr(
          'class',
          (d) =>
            `vic-geography-g ${this.formatForClassName(
              this.config.featureIndexAccessor(d)
            )}`
        );

      geographyGroup
        .selectAll<SVGPathElement, GeographiesFeature<TProperties, TGeometry>>(
          'path'
        )
        .data<GeographiesFeature<TProperties, TGeometry>>(
          (d) => [d],
          (d) => this.config.featureIndexAccessor(d)
        )
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('d', (feature) => this.path(feature))
              .attr('class', (feature) =>
                this.formatForClassName(layer.featureIndexAccessor(feature))
              )
              // layer-index is used on event directives
              .attr('data-layer-index', layer.id)
              .attr('stroke', layer.strokeColor)
              .attr('stroke-width', layer.strokeWidth)
              .attr('fill', (feature) => layer.getFill(feature)),
          (update) =>
            update.call((update) =>
              update
                .attr('d', (feature) => this.path(feature))
                .attr('class', (feature) =>
                  this.formatForClassName(layer.featureIndexAccessor(feature))
                )
                .attr('stroke', layer.strokeColor)
                .attr('stroke-width', layer.strokeWidth)
                .transition(t)
                .attr('fill', (feature) => layer.getFill(feature))
            ),
          (exit) => exit.remove()
        );

      if (layer.labels) {
        geographyGroup
          .filter((feature) =>
            layer.labels.display(layer.labels.valueAccessor(feature))
          )
          .selectAll<
            SVGTextElement,
            GeographiesFeature<TProperties, TGeometry>
          >('.vic-geography-label')
          .data<GeographiesFeature<TProperties, TGeometry>>(
            (d) => [d],
            (d) => this.config.featureIndexAccessor(d)
          )
          .join(
            (enter) =>
              enter
                .append('text')
                .attr('class', 'vic-geography-label')
                // layer-index is used on event directives
                .attr('data-layer-index', layer.id)
                .attr('text-anchor', layer.labels.textAnchor)
                .attr('alignment-baseline', layer.labels.alignmentBaseline)
                .attr('dominant-baseline', layer.labels.dominantBaseline)
                .style('cursor', layer.labels.cursor)
                .attr('pointer-events', layer.labels.pointerEvents)
                .text((feature) => layer.labels.valueAccessor(feature))
                .attr(
                  'x',
                  (feature) => this.getLabelPosition(feature, layer.labels).x
                )
                .attr(
                  'y',
                  (feature) => this.getLabelPosition(feature, layer.labels).y
                )
                .attr('font-size', layer.labels.fontScale(this.ranges.x[1]))
                .attr('fill', (feature) => layer.getLabelColor(feature))
                .attr('font-weight', (feature) =>
                  layer.getLabelFontWeight(feature)
                ),
            (update) =>
              update.call((update) =>
                update
                  .text((feature) => layer.labels.valueAccessor(feature))
                  .attr(
                    'y',
                    (feature) => this.getLabelPosition(feature, layer.labels).y
                  )
                  .attr(
                    'x',
                    (feature) => this.getLabelPosition(feature, layer.labels).x
                  )
                  .attr('font-size', layer.labels.fontScale(this.ranges.x[1]))
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .transition(t as any)
                  .attr('fill', (feature) => layer.getLabelColor(feature))
                  .attr('font-weight', (feature) =>
                    layer.getLabelFontWeight(feature)
                  )
              ),
            (exit) => exit.remove()
          );
      }
    });
  }

  getLabelPosition(
    d: GeographiesFeature<TProperties, TGeometry>,
    labels: GeographiesLabels<TProperties, TGeometry>
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return labels.position(d, this.path, this.projection);
  }

  updateGeographyElements(): void {
    const pathsByLayer = this.config.layers.reduce(
      (paths, layer, i) => {
        if (layer.enableEventActions) {
          paths.push(
            select(this.elRef.nativeElement).selectAll(`.layer-${i} path`)
          );
        }
        return paths;
      },
      [] as Selection<
        SVGPathElement,
        GeographiesFeature<TProperties, TGeometry>,
        SVGGElement,
        GeographiesFeature<TProperties, TGeometry>
      >[]
    );
    this.pathsByLayer.next(pathsByLayer);
  }
}
