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
import { Observable } from 'rxjs';
import { ClickDirective } from '../events/click.directive';
import { EventEffect } from '../events/effect';
import { ListenElement } from '../events/event.directive';
import { GeographiesHoverMoveDirective } from './geographies-hover-move.directive';
import {
  GeographiesHoverDirective,
  GeographiesHoverOutput,
} from './geographies-hover.directive';
import { GeographiesInputEventDirective } from './geographies-input-event.directive';
import {
  getGeographiesTooltipData,
  GeographiesEventOutput,
} from './geographies-tooltip-data';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

type GeographiesEventDirective =
  | GeographiesHoverDirective
  | GeographiesHoverMoveDirective
  | GeographiesInputEventDirective;

@Directive({
  selector: '[vicGeographiesClickEffects]',
})
export class GeographiesClickDirective extends ClickDirective {
  @Input('vicGeographiesClickEffects')
  effects: EventEffect<GeographiesClickDirective>[];
  @Input('vicGeographiesClickRemoveEvent$')
  override clickRemoveEvent$: Observable<void>;
  @Output('vicGeographiesClickOutput') eventOutput =
    new EventEmitter<GeographiesEventOutput>();

  constructor(
    @Inject(GEOGRAPHIES) public geographies: GeographiesComponent,
    @Self()
    @Optional()
    public hoverDirective?: GeographiesHoverDirective,
    @Self()
    @Optional()
    public hoverAndMoveDirective?: GeographiesHoverMoveDirective,
    @Self()
    @Optional()
    public inputEventDirective?: GeographiesInputEventDirective
  ) {
    super();
  }

  setListenedElements(): void {
    this.elements = [this.geographies.chart.svgRef.nativeElement];
    this.setListeners();
  }

  onElementClick(event: PointerEvent, el: ListenElement): void {
    this.effects.forEach((effect) => effect.applyEffect(this));
  }

  onClickRemove(): void {
    this.effects.forEach((effect) => effect.removeEffect(this));
  }

  getTooltipData(): GeographiesEventOutput {
    if (!this.hoverDirective) {
      console.warn(
        'Tooltip data can only be retrieved when a GeographiesHoverMoveDirective and a GeographiesHoverDirective are implemented.'
      );
    }
    if (this.hoverDirective) {
      const data = getGeographiesTooltipData(
        this.hoverDirective.geographyIndex,
        this.geographies
      );
      const extras = {
        positionX: this.hoverDirective.positionX,
        positionY: this.hoverDirective.positionY,
      };
      return { ...data, ...extras };
    } else {
      return null;
    }
  }

  preventHoverEffects(): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) => this.disableEffect(directive));
  }

  resumeHoverEffects(removeEffects = true): void {
    const hoverEventDirectives = [
      this.hoverDirective,
      this.hoverAndMoveDirective,
    ];
    hoverEventDirectives.forEach((directive) =>
      this.enableEffect(directive, removeEffects)
    );
  }

  preventInputEventEffects(): void {
    this.disableEffect(this.inputEventDirective);
  }

  resumeInputEventEffects(removeEffects = true): void {
    this.enableEffect(this.inputEventDirective, removeEffects);
  }

  disableEffect(directive: GeographiesEventDirective): void {
    if (directive) {
      directive.preventEffect = true;
    }
  }

  enableEffect(
    directive: GeographiesEventDirective,
    removeEffects: boolean
  ): void {
    if (directive) {
      directive.preventEffect = false;
      if (removeEffects) {
        directive.effects.forEach((effect) => effect.removeEffect(directive));
      }
    }
  }
}
