import { Pipe, PipeTransform } from '@angular/core';
/**
 * @internal
 */
@Pipe({
  name: 'resizeChartHeight',
  standalone: true,
})
export class ResizeChartHeightPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(divWidth: any, maxHeight: number, maxWidth: number): any {
    if (typeof divWidth !== 'number') {
      return divWidth;
    } else if (divWidth < maxWidth) {
      const aspectRatio = maxWidth / maxHeight;
      return divWidth / aspectRatio;
    } else {
      return maxHeight;
    }
  }
}
