import { SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash-es';

export class NgOnChangesUtilities {
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
