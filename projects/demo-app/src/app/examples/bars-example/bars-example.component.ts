import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  VicBarsModule,
  VicChartModule,
  VicHtmlTooltipModule,
  VicXQuantitativeAxisModule,
  VicXyBackgroundModule,
  VicXyChartModule,
  VicYOrdinalAxisModule,
} from 'projects/viz-components/src/public-api';
import { SingleDisplayComponent } from '../../example-display/single-display/single-display.component';
import { SplitDisplayComponent } from '../../example-display/split-display/split-display.component';
import { BasicBarComponent } from './basic-bar/basic-bar.component';

@Component({
  selector: 'app-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    SingleDisplayComponent,
    SplitDisplayComponent,
    VicChartModule,
    VicBarsModule,
    VicXyChartModule,
    VicXyBackgroundModule,
    VicYOrdinalAxisModule,
    VicXQuantitativeAxisModule,
    VicHtmlTooltipModule,
    MatButtonModule,
    BasicBarComponent,
  ],
  templateUrl: './bars-example.component.html',
  styleUrls: ['./bars-example.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BarsExampleComponent {}
