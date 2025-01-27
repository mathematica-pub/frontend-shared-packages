import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  ViewEncapsulation,
} from '@angular/core';
import { GeoPath, geoPath, GeoProjection, select } from 'd3';
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

export type GeographiesSvgElement = 'layer' | 'g' | 'feature' | 'label';

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
  host: {
    '[class]': 'config.class',
    '[style.mixed-blend-mode]': 'config.blendMode',
  },
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
  public elRef = inject<ElementRef<SVGGElement>>(ElementRef);

  get class(): Record<GeographiesSvgElement, string> {
    return {
      layer: this.config.class + '-layer',
      g: this.config.class + '-group',
      feature: this.config.class + '-feature',
      label: this.config.class + '-label',
    };
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
      [
        this.ranges.x[1] - this.ranges.x[0],
        this.ranges.y[0] - this.ranges.y[1],
      ],
      this.config.boundary
    );
  }

  setPath(): void {
    this.path = geoPath().projection(this.projection);
  }

  updateChartAttributeProperties(): void {
    this.chart.updateAttributeProperties({
      scale: this.config.attributeDataLayer.attributeDimension.getScale(),
      config: this.config.attributeDataLayer.attributeDimension,
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
      .style(
        'transform',
        `translate(${this.chart.margin.left}px, ${this.chart.margin.top}px)`
      )
      .selectAll<
        SVGGElement,
        | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
        | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>
      >(`.${this.class.layer}`)
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
              (layer) =>
                `${this.class.layer} ${this.class.layer}-${layer.id} ${'attributeDimension' in layer ? 'attribute-data-layer' : 'geojson-properties-layer'}`
            ),
        (update) => update,
        (exit) => exit.remove()
      );

    this.config.layers.forEach((layer) => {
      const geographyGroup = layerGroup
        .filter((d) => d.id === layer.id)
        .selectAll<SVGGElement, GeographiesFeature<TProperties, TGeometry>>(
          `.${this.class.g}`
        )
        .data<GeographiesFeature<TProperties, TGeometry>>(
          (d) => d.geographies,
          (d) => this.config.featureIndexAccessor(d)
        )
        .join('g')
        .attr(
          'class',
          (d) =>
            `${this.class.g} ${this.getFormattedClassName(
              this.config.featureIndexAccessor(d)
            )}`
        );

      geographyGroup
        .selectAll<SVGPathElement, GeographiesFeature<TProperties, TGeometry>>(
          `.${this.class.feature}`
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
              .attr('class', this.class.feature)
              // layer-index is used on event directives
              .attr('data-layer-index', layer.id)
              .attr('stroke', layer.stroke.color)
              .attr('stroke-dasharray', layer.stroke.dasharray)
              .attr('stroke-linecap', layer.stroke.linecap)
              .attr('stroke-join', layer.stroke.linejoin)
              .attr('stroke-opacity', layer.stroke.opacity)
              .attr('stroke-width', layer.stroke.width)
              .attr('fill', (feature) => layer.getFill(feature)),
          (update) =>
            update.call((update) =>
              update
                .attr('d', (feature) => this.path(feature))
                .attr('class', this.class.feature)
                .attr('data-layer-index', layer.id)
                .transition(t)
                .attr('fill', (feature) => layer.getFill(feature))
                .attr('stroke', layer.stroke.color)
                .attr('stroke-dasharray', layer.stroke.dasharray)
                .attr('stroke-linecap', layer.stroke.linecap)
                .attr('stroke-join', layer.stroke.linejoin)
                .attr('stroke-opacity', layer.stroke.opacity)
                .attr('stroke-width', layer.stroke.width)
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
          >(`.${this.class.label}`)
          .data<GeographiesFeature<TProperties, TGeometry>>(
            (d) => [d],
            (d) => this.config.featureIndexAccessor(d)
          )
          .join(
            (enter) =>
              enter
                .append('text')
                .attr('class', this.class.label)
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

  getFormattedClassName(s: string): string {
    return s.replace(/\s/g, '-');
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
            select(this.elRef.nativeElement).selectAll(
              `.${this.class.layer}-${i} .${this.class.feature}`
            )
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
