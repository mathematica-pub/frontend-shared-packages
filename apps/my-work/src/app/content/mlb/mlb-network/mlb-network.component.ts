/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  VicChartConfigBuilder,
  VicChartModule,
  VicGroupedBarsConfigBuilder,
  VicGroupedBarsModule,
  VicStackedBarsConfigBuilder,
  VicXQuantitativeAxisConfigBuilder,
  VicXyAxisModule,
  VicYOrdinalAxisConfigBuilder,
} from '@hsi/viz-components';
import { ExportContentComponent } from 'apps/my-work/src/app/platform/export-content/export-content.component';
import { CaChartService } from '../../ca/ca-chart.service';
import { CaDotPlotService } from '../../ca/ca-dot-plot.service';
import { NotesComponent } from '../../ca/notes/notes.component';
import { MlbBarComponent } from '../mlb-bar/mlb-bar.component';

@Component({
  selector: 'app-mlb-network',
  standalone: true,
  imports: [
    CommonModule,
    ExportContentComponent,
    ReactiveFormsModule,
    VicChartModule,
    VicGroupedBarsModule,
    VicXyAxisModule,
    NotesComponent,
  ],
  templateUrl: '../mlb-bar/mlb-bar.component.html',
  styleUrl: '../mlb-bar/mlb-bar.component.scss',
  providers: [
    VicChartConfigBuilder,
    CaChartService,
    CaDotPlotService,
    VicGroupedBarsConfigBuilder,
    VicYOrdinalAxisConfigBuilder,
    VicStackedBarsConfigBuilder,
    VicXQuantitativeAxisConfigBuilder,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MlbNetworkComponent extends MlbBarComponent implements OnInit {
  override stratKeyword = 'network';
}
