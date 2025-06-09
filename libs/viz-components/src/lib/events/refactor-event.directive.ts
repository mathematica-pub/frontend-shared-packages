import {
  AfterViewInit,
  DestroyRef,
  Directive,
  inject,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { pointer } from 'd3';
import { Observable } from 'rxjs';
import { EventAction } from './action';

export type UnlistenFunction = () => void;
export type ListenElement = HTMLElement | SVGElement;

export enum EventType {
  Click = 'click',
  Hover = 'hover',
  HoverMove = 'hoverMove',
  Input = 'input',
}

export interface ActionHost<Output> {
  getInteractionOutput(type: EventType): Output;
  setPositionsFromElement(): void;
  setPositionsFromPointer(event: PointerEvent): void;
  disableOtherActions(eventType: EventType): void;
  resumeOtherActions(
    eventType: EventType,
    cancelCurrentActions?: boolean
  ): void;
  emitInteractionOutput(output: Output): void;
}

export interface MarksHost<Output, MarksComponent = unknown>
  extends ActionHost<Output> {
  marks: MarksComponent;
}

export interface EventStrategy {
  bindTo(elements: Element[], renderer: Renderer2): UnlistenFunction[];
}

@Directive()
export abstract class RefactorEventDirective<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Host extends ActionHost<unknown> = any,
  >
  implements AfterViewInit, OnDestroy
{
  @Input() clickRemoveEvent$: Observable<void>;
  @Input() inputEvent$: Observable<unknown>;
  protected destroyRef = inject(DestroyRef);
  protected renderer = inject(Renderer2);

  protected abstract getElements(): Observable<Element[]>;
  protected abstract onClickRemove(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract onInputEvent(event: any): void;
  protected abstract setPositionsFromElement(): void;
  protected abstract setupListeners(elements: Element[]): UnlistenFunction[];

  protected unlistenFns: UnlistenFunction[] = [];
  protected events: EventType[] = [];
  preventAction: Record<EventType, boolean> = {
    click: false,
    hover: false,
    hoverMove: false,
    input: false,
  };
  positionX: number;
  positionY: number;

  ngAfterViewInit(): void {
    this.getElements()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((els) => {
        this.unlistenFns.forEach((fn) => fn());
        this.unlistenFns = this.setupListeners(els);
      });

    if (this.clickRemoveEvent$) {
      this.clickRemoveEvent$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.onClickRemove());
    }

    if (this.inputEvent$) {
      this.inputEvent$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => this.onInputEvent(event));
    }
  }

  ngOnDestroy(): void {
    this.unlistenFns.forEach((fn) => fn());
  }

  protected bindEventListeners(
    elements: Element[],
    handlers: Partial<{
      pointerenter: (event: PointerEvent, el: Element) => void;
      pointermove: (event: PointerEvent, el: Element) => void;
      pointerleave: (event: PointerEvent, el: Element) => void;
      click: (event: PointerEvent, el: Element) => void;
    }>
  ): UnlistenFunction[] {
    return elements.map((el) => {
      const unlistenFns: UnlistenFunction[] = [];

      if (handlers.pointerenter)
        unlistenFns.push(
          this.renderer.listen(el, 'pointerenter', (e) =>
            handlers.pointerenter(e, el)
          )
        );
      if (handlers.pointermove)
        unlistenFns.push(
          this.renderer.listen(el, 'pointermove', (e) =>
            handlers.pointermove(e, el)
          )
        );
      if (handlers.pointerleave)
        unlistenFns.push(
          this.renderer.listen(el, 'pointerleave', (e) =>
            handlers.pointerleave(e, el)
          )
        );
      if (handlers.click)
        unlistenFns.push(
          this.renderer.listen(el, 'click', (e) => handlers.click(e, el))
        );

      return () => unlistenFns.forEach((fn) => fn());
    });
  }

  disableOtherActions(eventType: EventType): void {
    Object.keys(this.preventAction).forEach((key) => {
      if (key !== eventType) {
        this.preventAction[key as EventType] = true;
      }
    });
  }

  resumeOtherActions(eventType: EventType, cancelCurrentActions = true): void {
    Object.keys(this.preventAction).forEach((key) => {
      const isCurrent = key === eventType;
      const shouldResume = !isCurrent || cancelCurrentActions;
      if (shouldResume) {
        this.preventAction[key as EventType] = false;
      }
    });
  }

  setPositionsFromPointer(event: PointerEvent): void {
    [this.positionX, this.positionY] = pointer(event);
  }

  protected runActions<T extends EventAction<Host>>(
    actions: T[] | null | undefined,
    fn: (action: T) => void
  ): void {
    if (!actions?.length) return;
    actions.forEach(fn);
  }

  protected hasEvent(event: EventType): boolean {
    return this.events.includes(event);
  }

  protected isEventAllowed(event: EventType): boolean {
    return this.hasEvent(event) && !this.preventAction[event];
  }

  protected asHost(): Host {
    return this as unknown as Host;
  }
}
