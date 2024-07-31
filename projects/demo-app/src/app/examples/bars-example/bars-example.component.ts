import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SingleDisplayComponent } from '../../example-display/single-display/single-display.component';
import { SplitDisplayComponent } from '../../example-display/split-display/split-display.component';
import { BasicBarsComponent } from './basic-bars/basic-bars.component';

@Component({
  selector: 'app-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    SingleDisplayComponent,
    SplitDisplayComponent,
    BasicBarsComponent,
  ],
  templateUrl: './bars-example.component.html',
  styleUrls: ['../examples.scss', './bars-example.component.scss'],
})
export class BarsExampleComponent {}
