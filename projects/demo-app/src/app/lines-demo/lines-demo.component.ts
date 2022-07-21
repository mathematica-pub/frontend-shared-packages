import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmploymentDatum } from '../core/models/employement-data';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-lines-demo',
  templateUrl: './lines-demo.component.html',
  styleUrls: ['./lines-demo.component.scss'],
})
export class LinesDemoComponent implements OnInit {
  data$: Observable<EmploymentDatum[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.employmentData$;
  }
}
