import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { pointer, select } from 'd3';
import { GeographiesHoverAndMoveEffect } from './geographies-effect';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

type UnlistenFunction = () => void;
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
export class GeographiesHoverAndMoveEventDirective
  implements OnDestroy, AfterViewInit
{
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('vicGeographiesHoverAndMoveEffects')
  effects: GeographiesHoverAndMoveEffect[];
  @Input() pointerDetectionRadius: number | null = 80;
  @Output() hoverAndMoveEventOutput =
    new EventEmitter<GeographiesEmittedOutput>();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;
  unlistenPointerEnter: UnlistenFunction[];
  unlistenPointerLeave: UnlistenFunction[];
  unlistenTouchStart: UnlistenFunction[];

  constructor(
    @Inject(GEOGRAPHIES) public geographies: GeographiesComponent,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.unlistenTouchStart.forEach((func) => func());
    this.unlistenPointerEnter.forEach((func) => func());
  }

  ngAfterViewInit(): void {
    this.setListeners();
  }

  setListeners(): void {
    const elements = this.geographies.dataGeographies.nodes();
    this.setTouchStartListener(elements);
    this.setPointerEnterListener(elements);
    // this.geographies.dataGeographies
    // .on('touchstart', (event, d) => {
    //   event.preventDefault();
    // })
    // .on('pointermove', (event, d) => this.geographyPointerMove(event, d))
    // .on('pointerleave', () => this.geographyPointerLeave());
  }

  setTouchStartListener(elements: Element[]) {
    this.unlistenTouchStart = elements.map((el) =>
      this.renderer.listen(el, 'touchstart', (event) => {
        this.onTouchStart(event);
      })
    );
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
  }

  setPointerEnterListener(elements: Element[]) {
    this.unlistenPointerEnter = elements.map((el) =>
      this.renderer.listen(el, 'pointerenter', (event) => {
        this.onPointerEnter(event, el);
      })
    );
  }

  onPointerEnter(event: PointerEvent, el: Element): void {
    const datum = select(el).datum();
    this.geographyPointerMove(event, datum);
    this.setPointerLeaveListener(el);
  }

  setPointerLeaveListener(el: Element) {
    const unlistenPointerLeave = this.renderer.listen(
      el,
      'pointerleave',
      () => {
        this.geographyPointerLeave();
        unlistenPointerLeave();
      }
    );
  }

  geographyPointerMove(event: PointerEvent, d: any): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    this.geographyIndex = this.getGeographyIndex(d);
    console.log(this.geographyIndex);
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
