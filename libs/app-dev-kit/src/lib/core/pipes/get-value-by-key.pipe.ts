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
    return element ? element[key] : null;
  }
}
