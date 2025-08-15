import { Pipe, PipeTransform } from '@angular/core';
/**
 * Retrieves the key in the object.
 * @deprecated This pipe is deprecated. There is no longer a need for a
 * custom key accessor pipe since we are now using Tanstack library
 * for our table implementation. See `tanstack-example.component.ts` in `ui-components` for
 * the recommended table implementation.
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
