import { SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash';

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
    let prevString = `${inputName}.previousValue`;
    let currString = `${inputName}.currentValue`;
    if (property) {
      prevString += `.${property}`;
      currString += `.${property}`;
    }
    return (
      changes[inputName] !== undefined &&
      !isEqual(get(changes, prevString), get(changes, currString))
    );
  }
}
