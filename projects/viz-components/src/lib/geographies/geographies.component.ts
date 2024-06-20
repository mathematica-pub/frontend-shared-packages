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
import { ChartComponent } from '../chart/chart.component';
import { VIC_DATA_MARKS } from '../data-marks/data-marks';
import { MapChartComponent } from '../map-chart/map-chart.component';
import { VicMapDataMarks } from '../map-data-marks/map-data-marks';
import { VicGeographiesConfig } from './config/geographies.config';
import { VicGeographiesLabels } from './config/layers/geographies-labels';
import { VicGeographiesFeature } from './geographies-feature';

export type LayersGroup = Selection<SVGGElement, unknown, null, undefined>;

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
  pathsByLayer: BehaviorSubject<
    Selection<
      SVGPathElement,
      VicGeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      VicGeographiesFeature<TProperties, TGeometry>
    >[]
  > = new BehaviorSubject(null);
  pathsByLayer$: Observable<
    Selection<
      SVGPathElement,
      VicGeographiesFeature<TProperties, TGeometry>,
      SVGGElement,
      VicGeographiesFeature<TProperties, TGeometry>
    >[]
  > = this.pathsByLayer.asObservable();

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
    this.config.layers.forEach((layer, i) => {
      const layerGroup = select(this.elRef.nativeElement)
        .append('g')
        .attr('class', `vic-geographies-layer layer-${i} ${layer.class ?? ''}`);

      const geographyGroup = layerGroup
        .selectAll<SVGGElement, VicGeographiesFeature<TProperties, TGeometry>>(
          `.geography-g`
        )
        .data<VicGeographiesFeature<TProperties, TGeometry>>(layer.geographies)
        .join(
          (enter) => enter.append('g').attr('class', '.geography-g'),
          (update) => update,
          (exit) => exit.remove()
        );

      geographyGroup
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
              .attr('layer-index', i)
              .attr('stroke', layer.strokeColor)
              .attr('stroke-width', layer.strokeWidth)
              .attr('fill', (d) => layer.getFill(d)),
          (update) =>
            update.call((update) =>
              update
                .attr('d', this.path)
                .attr('layer-index', i)
                .attr('stroke', layer.strokeColor)
                .attr('stroke-width', layer.strokeWidth)
                .transition(t)
                .attr('fill', (d) => layer.getFill(d))
            ),
          (exit) => exit.remove()
        );

      if (layer.labels) {
        geographyGroup
          .filter((d) => layer.labels.display(layer.labels.valueAccessor(d)))
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
                .attr('layer-index', i)
                .attr('text-anchor', layer.labels.textAnchor)
                .attr('alignment-baseline', layer.labels.alignmentBaseline)
                .attr('dominant-baseline', layer.labels.dominantBaseline)
                .style('cursor', layer.labels.cursor)
                .attr('pointer-events', layer.labels.pointerEvents)
                .text((d) => layer.labels.valueAccessor(d))
                .attr('x', (d) => this.getLabelPosition(d, layer.labels).x)
                .attr('y', (d) => this.getLabelPosition(d, layer.labels).y)
                .attr('font-size', layer.labels.fontScale(this.ranges.x[1]))
                .attr('fill', (d) => layer.getLabelColor(d))
                .attr('font-weight', (d) => layer.getLabelFontWeight(d)),
            (update) =>
              update.call((update) =>
                update
                  .text((d) => layer.labels.valueAccessor(d))
                  .attr('layer-index', i)
                  .attr('y', (d) => this.getLabelPosition(d, layer.labels).y)
                  .attr('x', (d) => this.getLabelPosition(d, layer.labels).x)
                  .attr('font-size', layer.labels.fontScale(this.ranges.x[1]))
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .transition(t as any)
                  .attr('fill', (d) => layer.getLabelColor(d))
                  .attr('font-weight', (d) => layer.getLabelFontWeight(d))
              ),
            (exit) => exit.remove()
          );
      }
    });
  }

  getLabelPosition(
    d: VicGeographiesFeature<TProperties, TGeometry>,
    labels:
      | VicGeographiesLabels<Datum, TProperties, TGeometry>
      | VicGeographiesLabels<string, TProperties, TGeometry>
  ): { x: number; y: number } {
    if (!this.path || !this.projection) return { x: 0, y: 0 };
    return labels.position(d, this.path, this.projection);
  }

  updateGeographyElements(): void {
    const pathsByLayer = this.config.layers.reduce((paths, layer, i) => {
      if (layer.enableEffects) {
        paths.push(
          select(this.elRef.nativeElement).selectAll(`.layer-${i} path`)
        );
      }
      return paths;
    }, [] as Selection<SVGPathElement, VicGeographiesFeature<TProperties, TGeometry>, SVGGElement, VicGeographiesFeature<TProperties, TGeometry>>[]);
    this.pathsByLayer.next(pathsByLayer);
  }
}
