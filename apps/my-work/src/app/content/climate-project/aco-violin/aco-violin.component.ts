import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';
import { AcoBarComponent } from './aco-violin-chart/aco-violin-chart.component';

export interface ACODatum {
  aco_id: string;
  gensaaveloss: number;
  savloss_climate: number;
  savloss_climate_perc: number;
  savloss_diff: number;
}

// instead of doing a violin chart, we could instead do a dot style chart or a bar chart, where the left side is savings and losses on 2022 benchmarks and the right side is savings/losses on 2022 benchmarks plus climate costs

// the actual benchmark values are not important, just the difference between the two values

// one method would be to aggregate the plus/minus savings and then do a violin chart, comparing the two charts

// another would be to just do a bar chart of savings for each case. I think this is the best option

@Component({
  selector: 'app-aco-violin',
  standalone: true,
  imports: [CommonModule, ExportContentComponent, AcoBarComponent],
  templateUrl: './aco-violin.component.html',
  styleUrls: ['./aco-violin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcoViolinComponent implements OnInit {
  dataPath = 'content/example-data/ACO_climate_savings.csv';
  allData$: Observable<ACODatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.createData();
    this.allData$.subscribe((data) => console.log(data));
  }

  createData(): void {
    this.allData$ = this.dataService.getDataFile(this.dataPath).pipe(
      map((data) =>
        data.map((x) => ({
          aco_id: x.ACO_ID,
          gensaaveloss: parseFloat(x.GenSaveLoss),
          savloss_climate: parseFloat(x.SavLoss_Climate),
          savloss_climate_perc: parseFloat(x.SavLoss_Climate_perc),
          savloss_diff:
            parseFloat(x.SavLoss_Climate) - parseFloat(x.GenSaveLoss),
        }))
      )
    );
  }
}
