import { Renderer2 } from '@angular/core';

export type UnlistenFunction = () => void;
export type ListenElement = HTMLElement | SVGElement;

export enum EventType {
  Click = 'click',
  Hover = 'hover',
  HoverMove = 'hoverMove',
  Input = 'input',
}

export interface EventAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> {
  onStart: (host: Host) => void;
  onEnd: (host: Host) => void;
}

export interface HoverMoveAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> extends EventAction<Host> {
  initialize?: (host: Host) => void;
}

export interface InputEventAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> {
  onStart: (host: Host, ...args) => void;
  onEnd: (host: Host, ...args) => void;
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
