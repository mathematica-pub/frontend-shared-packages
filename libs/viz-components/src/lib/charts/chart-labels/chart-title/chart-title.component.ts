import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Host,
  Input,
  Optional,
} from '@angular/core';
import { MapChartComponent } from '../../map-chart/map-chart.component';
import { XyChartComponent } from '../../xy-chart/xy-chart.component';

@Component({
  selector: 'vic-chart-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-title.component.html',
  styleUrl: './chart-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTitleComponent<Datum> {
  @Input() alignment: 'left' | 'center' = 'left';

  constructor(
    @Optional() @Host() private xyChart: XyChartComponent,
    @Optional() @Host() private mapChart: MapChartComponent<Datum>
  ) {}

  get chart() {
    return this.xyChart ? this.xyChart : this.mapChart;
  }

  // ngOnInit(): void {
  //   const chart = this.xyChart ? this.xyChart : this.mapChart;
  //   chart.margin$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((margin) => {
  //       const titleContainer =
  //         this.el.nativeElement.querySelector('.vic-chart-title');

  //       if (this.alignment === 'left') {
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'marginLeft',
  //           `${margin.left}px`
  //         );
  //         this.renderer.setStyle(titleContainer, 'textAlign', 'left');
  //       } else if (this.alignment === 'center') {
  //         const totalWidth = chart.width;
  //         const contentWidth = totalWidth - margin.left - margin.right;

  //         this.renderer.setStyle(titleContainer, 'textAlign', 'center');
  //         this.renderer.setStyle(titleContainer, 'width', `${contentWidth}px`);
  //         this.renderer.setStyle(
  //           titleContainer,
  //           'marginLeft',
  //           `${margin.left}px`
  //         );
  //       }
  //     });
  // }
}
