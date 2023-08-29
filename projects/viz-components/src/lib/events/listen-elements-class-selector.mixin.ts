import { Observable, filter, takeUntil } from 'rxjs';
import { AbstractConstructor } from '../core/common-behaviors/constructor';
import { EventDirective } from './event.directive';

export function setListenedElementsClassSelectorMixinFunction<
  BaseType extends AbstractConstructor<EventDirective>
>(BaseClass: BaseType) {
  abstract class Mixin extends BaseClass {
    abstract selectionObservable: Observable<any>;
    abstract listenElementsClassSelector: string;

    setListenedElements() {
      this.selectionObservable
        .pipe(
          takeUntil(this.unsubscribe),
          filter((data) => !!data)
        )
        .subscribe((data) => {
          this.elements = !this.listenElementsClassSelector
            ? data.nodes()
            : data.filter(`.${this.listenElementsClassSelector}`).nodes();
          this.setListeners();
        });
    }
  }
  return Mixin;
}
