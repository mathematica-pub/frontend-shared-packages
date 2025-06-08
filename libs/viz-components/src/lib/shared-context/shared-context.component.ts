import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataValue } from '../core';

@Component({
  selector: 'vic-shared-context',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'vic-shared-context',
  },
})
export class SharedContextComponent<ChartMultipleDomain extends DataValue> {
  private pointerEnter: Subject<{
    event: PointerEvent;
    multiple: ChartMultipleDomain;
  }> = new Subject<{ event: PointerEvent; multiple: ChartMultipleDomain }>();
  pointerEnter$ = this.pointerEnter.asObservable();
  private pointerMove: Subject<{
    event: PointerEvent;
    multiple: ChartMultipleDomain;
  }> = new Subject<{ event: PointerEvent; multiple: ChartMultipleDomain }>();
  pointerMove$ = this.pointerMove.asObservable();
  private pointerLeave: Subject<ChartMultipleDomain> =
    new Subject<ChartMultipleDomain>();
  pointerLeave$ = this.pointerLeave.asObservable();
  private click: Subject<{
    event: PointerEvent;
    multiple: ChartMultipleDomain;
  }> = new Subject<{ event: PointerEvent; multiple: ChartMultipleDomain }>();
  click$ = this.click.asObservable();
  private inputEvent: Subject<{
    event: unknown;
    multiple: ChartMultipleDomain;
  }> = new Subject<{
    event: unknown;
    multiple: ChartMultipleDomain;
  }>();
  inputEvent$ = this.inputEvent.asObservable();

  sharePointerEnter(event: PointerEvent, multiple: ChartMultipleDomain): void {
    this.pointerEnter.next({
      event,
      multiple,
    });
  }

  sharePointerMove(event: PointerEvent, multiple: ChartMultipleDomain): void {
    this.pointerMove.next({
      event,
      multiple,
    });
  }

  sharePointerLeave(multiple: ChartMultipleDomain): void {
    this.pointerLeave.next(multiple);
  }
}
