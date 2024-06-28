/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from 'd3';
import { Feature, Geometry, MultiPolygon, Polygon } from 'geojson';
import { filter } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverDirective } from '../events/hover.directive';
import { VicGeographiesAttributeDataLayer } from './config/layers/data-layer';
import { VicGeographiesGeojsonPropertiesLayer } from './config/layers/geojson-properties-layer';
import { VicGeographiesFeature } from './geographies-feature';
import {
  VicGeographiesEventOutput,
  VicGeographiesTooltipOutput,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

interface GeographiesHoverExtras {
  feature: Feature;
  bounds: [[number, number], [number, number]];
}

export type GeographiesHoverOutput<Datum> = VicGeographiesTooltipOutput<Datum> &
  GeographiesHoverExtras;

@Directive({
  selector: '[vicGeographiesHoverEffects]',
})
export class GeographiesHoverDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> extends HoverDirective {
  @Input('vicGeographiesHoverEffects')
  effects: EventEffect<
    GeographiesHoverDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  bounds: [[number, number], [number, number]];
  layer:
    | VicGeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | VicGeographiesGeojsonPropertiesLayer<TProperties, TGeometry>;
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
    const d = select(this.path).datum() as VicGeographiesFeature<
      TProperties,
      TGeometry
    >;
    this.bounds = this.geographies.path.bounds(d);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getEventOutput(): VicGeographiesEventOutput<Datum | undefined> {
    const tooltipData = this.layer.getTooltipData(this.path);
    this.positionX = (this.bounds[1][0] + this.bounds[0][0]) / 2;
    this.positionY = (this.bounds[1][1] + this.bounds[0][1] * 2) / 3;
    return {
      ...tooltipData,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  }
}
