import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  data$: Observable<any>;
  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.data$ = this.dataService.getEmploymentData();
  }
  title = 'demo-app';
}
