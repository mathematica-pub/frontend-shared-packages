import { SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash-es';

/**
 * A utility class for detecting changes to objects in Angular's ngOnChanges lifecycle hook.
 */
export class NgOnChangesUtilities {
  /**
   * Checks if an input object has changed since the first change.
   * @param changes - The SimpleChanges object containing the changes.
   * @param inputName - The name of the input property to check.
   * @param property - Optional specific property to check within the input object.
   * @returns True if the input object has changed since the first change, otherwise false.
   */
  static inputObjectChangedNotFirstTime(
    changes: SimpleChanges,
    inputName: string,
    property?: string
  ): boolean {
    return (
      changes[inputName] !== undefined &&
      !changes[inputName].isFirstChange() &&
      this.inputObjectChanged(changes, inputName, property)
    );
  }

  /**
   * Checks if an input object has changed.
   * @param changes - The SimpleChanges object containing the changes.
   * @param inputName - The name of the input property to check.
   * @param property - Optional specific property to check within the input object.
   * @returns True if the input object has changed, otherwise false.
   */
  static inputObjectChanged(
    changes: SimpleChanges,
    inputName: string,
    property?: string
  ): boolean {
    let prevAccessor = `${inputName}.previousValue`;
    let currAccessor = `${inputName}.currentValue`;
    if (property) {
      prevAccessor += `.${property}`;
      currAccessor += `.${property}`;
    }
    return (
      changes[inputName] !== undefined &&
      !isEqual(get(changes, prevAccessor), get(changes, currAccessor))
    );
  }
}
