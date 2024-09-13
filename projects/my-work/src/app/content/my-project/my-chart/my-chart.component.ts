import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';

interface MyData {
  date: Date;
  industry: string;
  unemployed: number;
}

@Component({
  selector: 'app-my-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-chart.component.html',
  styleUrl: './my-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyChartComponent implements OnInit {
  dataPath = 'content/data/industry_unemployment.json';
  data$: Observable<MyData>;

  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.data$ = this.dataService
      .getDataFile(this.dataPath)
      .pipe(map((data: MyData[]) => (data as any).data));
  }
}
