import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import {
  MetroUnemploymentDatum,
  QuickStartExampleComponent,
} from './quick-start-example/quick-start-example.component';

@Component({
  selector: 'app-overview-content',
  standalone: true,
  imports: [
    CommonModule,
    ContentContainerComponent,
    SinglePanelExampleDisplayComponent,
    QuickStartExampleComponent,
  ],
  templateUrl: './overview-content.component.html',
  styleUrl: './overview-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewContentComponent implements OnInit {
  data$: Observable<MetroUnemploymentDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.data$ = this.dataService.metroUnemploymentData$.pipe(
      filter((data) => !!data),
      map((data) =>
        data
          .filter(
            (d) => d.date.getFullYear() === 2008 && d.date.getMonth() === 3
          )
          .slice(0, 15)
      )
    );
  }
}
