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
import { ExampleDisplayComponent } from '../../example-display/example-display.component';
import { BasicBarComponent } from './basic-bar/basic-bar.component';

@Component({
  selector: 'app-bars-example',
  standalone: true,
  imports: [
    CommonModule,
    ExampleDisplayComponent,
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
