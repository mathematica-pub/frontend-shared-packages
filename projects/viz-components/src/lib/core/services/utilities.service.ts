/* eslint-disable no-var */
import { Injectable, SimpleChanges } from '@angular/core';
import { isEqual } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  objectChangedNotFirstTime(changes: SimpleChanges, object: string): boolean {
    return (
      changes[object] !== undefined &&
      !changes[object].firstChange &&
      !isEqual(changes[object].previousValue, changes[object].currentValue)
    );
  }
}
