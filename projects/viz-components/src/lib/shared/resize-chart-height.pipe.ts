import { Pipe, PipeTransform } from '@angular/core';
/**
 * @internal
 */
@Pipe({
  name: 'resizeChartHeight',
})
export class ResizeChartHeightPipe implements PipeTransform {
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
