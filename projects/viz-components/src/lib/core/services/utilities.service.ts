/* eslint-disable no-var */
import { Injectable, SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  objectOnNgChangesChangedNotFirstTime(
    changes: SimpleChanges,
    object: string,
    property?: string
  ): boolean {
    return (
      changes[object] !== undefined &&
      !changes[object].firstChange &&
      this.objectOnNgChangesChanged(changes, object, property)
    );
  }

  objectOnNgChangesChanged(
    changes: SimpleChanges,
    object: string,
    property?: string
  ): boolean {
    let prevString = `${object}.previousValue`;
    let currString = `${object}.currentValue`;
    if (property) {
      prevString += `.${property}`;
      currString += `.${property}`;
    }
    return (
      changes[object] !== undefined &&
      !isEqual(get(changes, prevString), get(changes, currString))
    );
  }

  isDate(x: any): boolean {
    return Object.prototype.toString.call(x) === '[object Date]' && !isNaN(x);
  }

  getValueFromConstantOrFunction<T, K>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    arg: T extends Function ? never : T | ((d: K) => T),
    datum: K
  ): T {
    return typeof arg === 'function' ? arg(datum) : arg;
  }
}
