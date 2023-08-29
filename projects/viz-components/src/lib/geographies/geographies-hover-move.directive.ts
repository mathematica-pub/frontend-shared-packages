/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/no-output-rename */
import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { Observable } from 'rxjs';
import { EventEffect } from '../events/effect';
import { HoverMoveDirective } from '../events/hover-move.directive';
import {
  GeographiesEventOutput,
  getGeographiesTooltipData,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';
import { setListenedElementsClassSelectorMixinFunction } from '../events/listen-elements-class-selector.mixin';

const ListenElementsHoverMoveDirective =
  setListenedElementsClassSelectorMixinFunction(HoverMoveDirective);
@Directive({
  selector: '[vicGeographiesHoverMoveEffects]',
})
export class GeographiesHoverMoveDirective extends ListenElementsHoverMoveDirective {
  @Input('vicGeographiesHoverMoveEffects')
  effects: EventEffect<GeographiesHoverMoveDirective>[];
  @Input('vicGeographiesHoverMoveListenElementsClassSelector')
  listenElementsClassSelector: string;
  @Output('vicGeographiesHoverMoveOutput') eventOutput =
    new EventEmitter<GeographiesEventOutput>();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;
  selectionObservable: Observable<any>;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
    super();
    this.selectionObservable = geographies.dataGeographies$;
  }

  onElementPointerEnter(): void {
    return;
  }

  onElementPointerMove(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    const d = select(event.target as Element).datum();
    this.geographyIndex = this.getGeographyIndex(d);
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  onElementPointerLeave(): void {
    if (this.effects && !this.preventEffect) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }

  getEventOutput(): GeographiesEventOutput {
    const tooltipData = getGeographiesTooltipData(
      this.geographyIndex,
      this.geographies
    );
    const output: GeographiesEventOutput = {
      ...tooltipData,
      positionX: this.pointerX,
      positionY: this.pointerY,
    };
    return output;
  }
}
