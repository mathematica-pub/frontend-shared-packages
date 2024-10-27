/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Feature, Geometry, MultiPolygon, Polygon } from 'geojson';
import { filter } from 'rxjs';
import { EventAction } from '../../events/action';
import { HoverDirective } from '../../events/hover.directive';
import { GeographiesAttributeDataLayer } from '../config/layers/attribute-data-layer/attribute-data-layer';
import { GeographiesTooltipDatum } from '../config/layers/geographies-layer/geographies-layer';
import { GeographiesGeojsonPropertiesLayer } from '../config/layers/geojson-properties-layer/geojson-properties-layer';
import { GeographiesFeature } from '../geographies-feature';
import { GEOGRAPHIES, GeographiesComponent } from '../geographies.component';
import { GeographiesEventOutput } from './geographies-event-output';

interface GeographiesHoverExtras {
  feature: Feature;
  bounds: [[number, number], [number, number]];
}

export type GeographiesHoverOutput<Datum> = GeographiesTooltipDatum<Datum> &
  GeographiesHoverExtras;

@Directive({
  selector: '[vicGeographiesHoverActions]',
})
export class GeographiesHoverDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> extends HoverDirective {
  @Input('vicGeographiesHoverActions')
  actions: EventAction<
    GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverOutput') eventOutput = new EventEmitter<
    GeographiesEventOutput<Datum>
  >();
  bounds: [[number, number], [number, number]];
  layer:
    | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>;
  path: SVGPathElement;
  positionX: number;
  positionY: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: TComponent) {
    super();
  }

  setListenedElements(): void {
    this.geographies.pathsByLayer$
      .pipe(
        takeUntilDestroyed(this.geographies.destroyRef),
        filter((layers) => !!layers)
      )
      .subscribe((layers) => {
        this.elements = layers.flatMap((selections) => selections.nodes());
        this.setListeners();
      });
  }

  onElementPointerEnter(event: PointerEvent): void {
    this.path = event.target as SVGPathElement;
    const layerIndex = parseFloat(this.path.dataset['layerIndex']);
    this.layer =
      layerIndex === 0
        ? this.geographies.config.attributeDataLayer
        : this.geographies.config.geojsonPropertiesLayers[layerIndex - 1];
    const d = select(this.path).datum() as GeographiesFeature<
      TProperties,
      TGeometry
    >;
    this.bounds = this.geographies.path.bounds(d);
    console.log(this.bounds);
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onStart(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.actions && !this.preventAction) {
      this.actions.forEach((action) => action.onEnd(this));
    }
  }

  getEventOutput(): GeographiesEventOutput<Datum | undefined> {
    const tooltipData = this.layer.getTooltipData(this.path);
    this.positionX =
      (this.bounds[1][0] + this.bounds[0][0]) / 2 +
      this.geographies.chart.margin.left;
    this.positionY =
      (this.bounds[1][1] + this.bounds[0][1]) / 2 +
      this.geographies.chart.margin.top;
    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}
