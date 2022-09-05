import { Directive, OnDestroy } from '@angular/core';
import { EventDirective, UnlistenFunction } from './event';

@Directive()
export abstract class ClickEventDirective
  extends EventDirective
  implements OnDestroy
{
  unlistenClick: UnlistenFunction[];

  abstract chartClick(event: Event, el: Element): void;

  ngOnDestroy(): void {
    this.unlistenClick.forEach((func) => func());
  }

  setListeners(): void {
    this.unlistenClick = this.elements.map((el) =>
      this.renderer.listen(el, 'click', (event) => this.chartClick(event, el))
    );
  }
}
