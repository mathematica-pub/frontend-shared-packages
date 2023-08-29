import { AfterViewInit, Directive, inject, Renderer2 } from '@angular/core';
import { Unsubscribe } from '../shared/unsubscribe.class';
export type UnlistenFunction = () => void;
export type ListenElement = HTMLElement | SVGElement;

@Directive()
export abstract class EventDirective
  extends Unsubscribe
  implements AfterViewInit
{
  elements: ListenElement[];
  preventEffect = false;

  protected renderer = inject(Renderer2);

  abstract setListeners(): void;
  abstract setListenedElements(): void;

  ngAfterViewInit(): void {
    this.setListenedElements();
  }
}
