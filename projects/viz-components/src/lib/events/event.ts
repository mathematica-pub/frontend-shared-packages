import { AfterViewInit, Directive, inject, Renderer2 } from '@angular/core';

export type UnlistenFunction = () => void;

@Directive()
export abstract class EventDirective implements AfterViewInit {
  elements: Element[];
  protected renderer = inject(Renderer2);

  abstract setListeners(): void;
  abstract setElements(): void;

  ngAfterViewInit(): void {
    this.setElements();
    this.setListeners();
  }
}
