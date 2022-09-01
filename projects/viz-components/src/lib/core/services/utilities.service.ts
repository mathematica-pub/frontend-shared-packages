/* eslint-disable no-var */
import { Injectable, SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  objectChangedNotFirstTime(
    changes: SimpleChanges,
    object: string,
    property?: string
  ): boolean {
    return (
      changes[object] !== undefined &&
      !changes[object].firstChange &&
      this.objectChanged(changes, object, property)
    );
  }

  objectChanged(
    changes: SimpleChanges,
    object: string,
    property?: string
  ): boolean {
    return (
      changes[object] !== undefined &&
      !isEqual(
        get(changes[object].previousValue, property),
        get(changes[object].currentValue, property)
      )
    );
  }
}
