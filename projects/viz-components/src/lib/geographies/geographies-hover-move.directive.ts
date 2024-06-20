/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Geometry } from 'geojson';
import { filter } from 'rxjs';
import { HoverMoveEventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import { VicGeographiesDataLayer } from './config/layers/data-layer';
import { VicGeographiesNoDataLayer } from './config/layers/no-data-layer';
import { VicGeographiesEventOutput } from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
  selector: '[vicGeographiesHoverMoveEffects]',
})
export class GeographiesHoverMoveDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>
> extends HoverMoveDirective {
  @Input('vicGeographiesHoverMoveEffects')
  effects: HoverMoveEventEffect<
    GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverMoveOutput') eventOutput = new EventEmitter<
    VicGeographiesEventOutput<Datum>
  >();
  layer:
    | VicGeographiesDataLayer<Datum, TProperties, TGeometry>
    | VicGeographiesNoDataLayer<TProperties, TGeometry>;
  path: SVGPathElement;
  pointerX: number;
  pointerY: number;

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
    if (this.effects && !this.preventEffect) {
      this.path = event.target as SVGPathElement;
      const layerIndex = parseFloat(this.path.getAttribute('layer-index'));
      this.layer =
        layerIndex === 0
          ? this.geographies.config.dataLayer
          : this.geographies.config.noDataLayers[layerIndex - 1];
      this.effects.forEach((effect) => {
        if (effect.initializeEffect) {
          effect.initializeEffect(this);
        }
      });
    }
  }

  onElementPointerMove(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
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
    const output = {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return output;
  }
}
