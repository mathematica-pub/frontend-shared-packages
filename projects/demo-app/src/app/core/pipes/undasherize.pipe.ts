import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'undasherize', standalone: true })
export class UndasherizePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  transform(value: string, ...args: any[]) {
    return value.replace(/-/g, ' ');
  }
}
