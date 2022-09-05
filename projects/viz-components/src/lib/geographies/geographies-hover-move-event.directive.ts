import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { pointer } from 'd3';
import { GeographiesHoverAndMoveEffect } from './geographies-effect';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

export class GeographiesEmittedOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
  positionX?: number;
  positionY?: number;
}
@Directive({
  selector: '[vicGeographiesHoverAndMoveEffects]',
})
export class GeographiesHoverAndMoveEventDirective implements AfterViewInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesHoverAndMoveEffects')
  effects: GeographiesHoverAndMoveEffect[];
  @Input() pointerDetectionRadius: number | null = 80;
  @Output() hoverAndMoveEventOutput =
    new EventEmitter<GeographiesEmittedOutput>();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {}

  ngAfterViewInit(): void {
    this.setListeners();
  }

  setListeners(): void {
    this.geographies.dataGeographies
      .on('touchstart', (event, d) => {
        event.preventDefault();
      })
      .on('pointermove', (event, d) => this.geographyPointerMove(event, d))
      .on('pointerleave', () => this.geographyPointerLeave());
  }

  geographyPointerMove(event: PointerEvent, d: any): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    this.geographyIndex = this.getGeographyIndex(d);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  geographyPointerLeave() {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getPointerValuesArray(event: PointerEvent): [number, number] {
    return pointer(event);
  }

  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }
}
