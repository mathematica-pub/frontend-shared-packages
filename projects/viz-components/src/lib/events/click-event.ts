import { Directive, OnDestroy } from '@angular/core';
import { ChartSvgEventDirective } from './chart-svg-event';

@Directive()
export abstract class ClickEventDirective
  extends ChartSvgEventDirective
  implements OnDestroy
{
  unlistenClick: () => void;

  abstract chartClick(event: Event): void;

  ngOnDestroy(): void {
    this.unlistenClick();
  }

  setListeners(): void {
    this.unlistenClick = this.renderer.listen(this.el, 'click', (event) =>
      this.chartClick(event)
    );
  }
}
