import { AfterViewInit, Component } from '@angular/core';
import { BasemapService } from './core/services/basemap.service';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'demo-app';

  constructor(
    private basemap: BasemapService,
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
    this.dataService.initData();
    this.basemap.initMap();
  }
}
