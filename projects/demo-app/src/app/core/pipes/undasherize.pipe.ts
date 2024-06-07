import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'undasherize' })
export class UndasherizePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, ...args: any[]) {
    return value.replace(/-/g, ' ');
  }
}
