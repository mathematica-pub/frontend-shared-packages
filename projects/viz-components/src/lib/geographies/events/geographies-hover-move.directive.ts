/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Geometry } from 'geojson';
import { filter } from 'rxjs';
import { HoverMoveAction } from '../../events/action';
import { HoverMoveDirective } from '../../events/hover-move.directive';
import { GeographiesAttributeDataLayer } from '../config/layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from '../config/layers/geojson-properties-layer/geojson-properties-layer';
import { GEOGRAPHIES, GeographiesComponent } from '../geographies.component';
import { GeographiesEventOutput } from './geographies-event-output';

@Directive({
  selector: '[vicGeographiesHoverMoveActions]',
})
export class GeographiesHoverMoveDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> extends HoverMoveDirective {
  @Input('vicGeographiesHoverMoveActions')
  actions: HoverMoveAction<
    GeographiesHoverMoveDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Output('vicGeographiesHoverMoveOutput') eventOutput = new EventEmitter<
    GeographiesEventOutput<Datum>
  >();
  layer:
    | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>;
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
    if (this.actions && !this.preventAction) {
      this.path = event.target as SVGPathElement;
      const layerIndex = parseFloat(this.path.dataset['layerIndex']);
      this.layer =
        layerIndex === 0
          ? this.geographies.config.attributeDataLayer
          : this.geographies.config.geojsonPropertiesLayers[layerIndex - 1];
      this.actions.forEach((action) => {
        if (action.initialize) {
          action.initialize(this);
        }
      });
    }
  }

  onElementPointerMove(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
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
    const output = {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return output;
  }
}
