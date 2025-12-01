import { NgZone } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

/**
 *
 * @param zone: NgZone
 * @returns (source: Observable<T>) => Observable<void>
 *
 * A custom RxJS operator that runs an Angular change detection cycle after the source observable emits, and waits until the change detection cycle is complete before emitting the next value.
 *
 * Note that this is not intended to be used frequently. It is a workaround for cases where you need to ensure that Angular has completed change detection before continuing with the next operation, for example when you need to access a DOM element that is being created through multiple levels of content projection.
 *
 * @example
 * ```ts
 * this.myObservable.pipe(
 *   runNgChangeDetectionThen(this.zone),
 *   subscribe(() => {
 *    console.log('a change detection cycle has completed');
 *   })
 * );
 * ```
 */
export function runNgChangeDetectionThen<T>(
  zone: NgZone
): (source: Observable<T>) => Observable<void> {
  return function <T>(source: Observable<T>): Observable<void> {
    return source.pipe(
      switchMap(
        () =>
          new Promise<void>((resolve) => {
            zone.run(() => {
              Promise.resolve().then(() => {
                resolve();
              });
            });
          })
      )
    );
  };
}
