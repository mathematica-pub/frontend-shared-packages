import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'undasherize', standalone: true })
export class UndasherizePipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    return value.replace(/-/g, ' ');
  }
}
