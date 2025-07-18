import { Pipe, PipeTransform } from '@angular/core';
/**
 * Retrieves the key in the object.
 */
@Pipe({
  name: 'getValueByKey',
  standalone: true,
})
export class GetValueByKeyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(element: any, key: string): any {
    if (!element || !key) {
      throw new Error('Invalid input: element and key are required');
    }
    key.split('.').forEach((k) => {
      if (element && typeof element === 'object') {
        element = element[k];
      } else {
        throw new Error(`Subkey "${k}" not found in the object`);
      }
    });
    return element;
  }
}
