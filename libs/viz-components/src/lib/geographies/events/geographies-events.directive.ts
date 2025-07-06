import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Geometry, MultiPolygon, Polygon } from 'geojson';
import { filter, map, Observable } from 'rxjs';
import {
  EventAction,
  EventsDirective,
  EventType,
  HoverMoveAction,
  InputEventAction,
  MarksHost,
  UnlistenFunction,
} from '../../events';
import { GeographiesAttributeDataLayer } from '../config/layers/attribute-data-layer/attribute-data-layer';
import { GeographiesGeojsonPropertiesLayer } from '../config/layers/geojson-properties-layer/geojson-properties-layer';
import { GeographiesFeature } from '../geographies-feature';
import { GEOGRAPHIES, GeographiesComponent } from '../geographies.component';
import { GeographiesInteractionOutput } from './geographies-interaction-output';

export type GeographiesHost<Datum> = MarksHost<
  GeographiesInteractionOutput<Datum>,
  GeographiesComponent<Datum>
>;

@Directive({
  selector: '[vicGeographiesEvents]',
})
export class GeographiesEventsDirective<
  Datum,
  TProperties,
  TGeometry extends Geometry = MultiPolygon | Polygon,
  TComponent extends GeographiesComponent<
    Datum,
    TProperties,
    TGeometry
  > = GeographiesComponent<Datum, TProperties, TGeometry>,
> extends EventsDirective<GeographiesHost<Datum>> {
  @Input()
  hoverActions:
    | EventAction<GeographiesHost<Datum>, GeographiesInteractionOutput<Datum>>[]
    | null;
  @Input()
  hoverMoveActions:
    | HoverMoveAction<
        GeographiesHost<Datum>,
        GeographiesInteractionOutput<Datum>
      >[]
    | null;
  @Input()
  clickActions:
    | EventAction<GeographiesHost<Datum>, GeographiesInteractionOutput<Datum>>[]
    | null;
  @Input()
  inputEventActions: InputEventAction<
    GeographiesHost<Datum>,
    GeographiesInteractionOutput<Datum>
  >[];
  @Output() interactionOutput = new EventEmitter<
    GeographiesInteractionOutput<Datum>
  >();

  bounds: [[number, number], [number, number]];
  layer:
    | GeographiesAttributeDataLayer<Datum, TProperties, TGeometry>
    | GeographiesGeojsonPropertiesLayer<TProperties, TGeometry>;
  path: SVGPathElement;

  constructor(@Inject(GEOGRAPHIES) public geographies: TComponent) {
    super();
  }

  get marks(): GeographiesComponent<Datum, TProperties, TGeometry> {
    return this.geographies;
  }

  getElements(): Observable<Element[]> {
    return this.geographies.pathsByLayer$.pipe(
      filter((layers) => !!layers),
      map((layers) => layers.flatMap((selections) => selections.nodes()))
    );
  }

  setupListeners(elements: Element[]): UnlistenFunction[] {
    if (this.inputEventActions?.length && this.inputEvent$) {
      this.events.push(EventType.Input);
    }

    return this.bindEventListeners(
      elements,
      this.buildInteractionListeners({
        hover: this.hoverActions?.length && {
          pointerenter: (e, el) => this.onEnter(e, el),
          pointerleave: (e, el) => this.onLeave(e, el),
        },
        hoverMove: this.hoverMoveActions?.length && {
          pointerenter: (e, el) => this.onEnter(e, el),
          pointermove: (e, el) => this.onMove(e, el),
          pointerleave: (e, el) => this.onLeave(e, el),
        },
        click: this.clickActions?.length && {
          click: (e, el) => this.onClick(e, el),
        },
      })
    );
  }

  onEnter(_: PointerEvent, el: Element): void {
    this.initFromElement(el);

    if (this.isEventAllowed(EventType.Hover)) {
      this.setPositionsFromElement();
      this.runActions(this.hoverActions, (a) => a.onStart(this.asHost()));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.runActions(this.hoverMoveActions, (a) => {
        if (a.initialize) {
          a.initialize(this.asHost());
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event: PointerEvent, _: Element): void {
    if (this.isEventAllowed(EventType.HoverMove)) {
      this.setPositionsFromPointer(event);
      this.hoverMoveActions.forEach((action) => action.onStart(this.asHost()));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeave(_: PointerEvent, __: Element): void {
    if (this.isEventAllowed(EventType.Hover)) {
      this.hoverActions.forEach((action) => action.onEnd(this.asHost()));
    } else if (this.isEventAllowed(EventType.HoverMove)) {
      this.hoverMoveActions.forEach((action) => action.onEnd(this.asHost()));
    }
    this.resetDirective();
  }

  onClick(event: PointerEvent, el: Element): void {
    this.initFromElement(el);
    if (!this.preventAction.click) {
      if (this.hasEvent(EventType.Hover)) {
        this.setPositionsFromElement();
      } else {
        this.setPositionsFromPointer(event);
      }
      this.runActions(this.clickActions, (a) => a.onStart(this.asHost()));
    }
  }

  onClickRemove(): void {
    if (!this.preventAction.click) {
      this.runActions(this.clickActions, (a) => a.onEnd(this.asHost()));
      this.resetDirective();
    }
  }

  onInputEvent(inputValue: unknown): void {
    if (this.isEventAllowed(EventType.Input)) {
      if (inputValue === null || inputValue === undefined) {
        this.inputEventActions.forEach((action) =>
          action.onEnd(this.asHost(), inputValue)
        );
      } else {
        this.inputEventActions.forEach((action) =>
          action.onStart(this.asHost(), inputValue)
        );
      }
    }
  }

  initFromElement(el: Element): void {
    this.path = el as SVGPathElement;
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
  }

  setPositionsFromElement(): void {
    this.positionX = (this.bounds[1][0] - this.bounds[0][0]) / 2;
    this.positionY = (this.bounds[1][1] - this.bounds[0][1]) / 2;
  }

  getInteractionOutput(type: EventType): GeographiesInteractionOutput<Datum> {
    const tooltipData = this.layer.getTooltipData(this.path);
    return {
      ...tooltipData,
      origin: this.path,
      positionX: this.positionX,
      positionY: this.positionY,
      type,
    };
  }

  emitInteractionOutput(
    output: GeographiesInteractionOutput<Datum> | null
  ): void {
    this.interactionOutput.emit(output);
  }

  private resetDirective(): void {
    this.path = undefined;
    this.bounds = undefined;
    this.positionX = undefined;
    this.positionY = undefined;
    this.layer = undefined;
  }
}
