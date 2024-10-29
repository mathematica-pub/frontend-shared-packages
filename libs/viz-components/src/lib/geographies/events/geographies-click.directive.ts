/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { Observable, filter } from 'rxjs';
import { EventAction } from '../../events/action';
import { ClickDirective } from '../../events/click.directive';
import { GeographiesAttributeDataLayer } from '../config/layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from '../config/layers/geojson-properties-layer/geojson-properties-layer';
import { GeographiesFeature } from '../geographies-feature';
import { GEOGRAPHIES, GeographiesComponent } from '../geographies.component';
import { GeographiesEventDirective } from './geographies-event-directive';
import { GeographiesEventOutput } from './geographies-event-output';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import { GeographiesHoverDirective } from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';

@Directive({
  selector: '[vicGeographiesClickActions]',
})
export class GeographiesClickDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> extends ClickDirective {
  @Input('vicGeographiesClickActions')
  actions: EventAction<
    GeographiesClickDirective<Datum, TProperties, TGeometry, TComponent>
  >[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput = new EventEmitter<
    GeographiesEventOutput<Datum>
  >();
  feature: GeographiesFeature<TProperties, TGeometry>;
  layer:
    | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>;
  path: SVGPathElement;
  pointerX: number;
  pointerY: number;

  constructor(
    @Inject(GEOGRAPHIES) public geographies: TComponent,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ) {
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

  onElementClick(event: PointerEvent): void {
    this.path = event.target as SVGPathElement;
    const layerIndex = parseFloat(this.path.dataset['layerIndex']);
    this.layer =
      layerIndex === 0
        ? this.geographies.config.attributeDataLayer
        : this.geographies.config.geojsonPropertiesLayers[layerIndex - 1];
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    if (this.hoverDirective) {
      this.pointerX = this.hoverDirective.positionX;
      this.pointerY = this.hoverDirective.positionY;
    }
    this.actions.forEach((action) => action.onStart(this));
  }

  onClickRemove(): void {
    this.actions.forEach((action) => action.onEnd(this));
    this.pointerX = undefined;
    this.pointerY = undefined;
    this.feature = undefined;
  }

  getOutputData(): GeographiesEventOutput<Datum | undefined> {
    const tooltipData = this.layer.getTooltipData(this.path);
    return {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
  }

  preventHoverActions(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableAction(directive));
  }

  resumeHoverActions(cancelCurrentActions = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableAction(directive, cancelCurrentActions)
    );
  }

  preventInputEventActions(): void {
    this.disableAction(this.inputEventDirective);
  }

  resumeInputEventActions(cancelCurrentActions = true): void {
    this.enableAction(this.inputEventDirective, cancelCurrentActions);
  }

  disableAction(
    directive: GeographiesEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >
  ): void {
    if (directive) {
      directive.preventAction = true;
    }
  }

  enableAction(
    directive: GeographiesEventDirective<
      Datum,
      TProperties,
      TGeometry,
      TComponent
    >,
    cancelCurrentActions: boolean
  ): void {
    if (directive) {
      directive.preventAction = false;
      if (cancelCurrentActions) {
        directive.actions.forEach((action) => action.onEnd(directive));
      }
    }
  }
}
