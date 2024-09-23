import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { VicXyChartModule } from '@hsi/viz-components';
import { EnergyIntensityDatum } from '../../../examples/energy-intensity/energy-intensity.component';

@Component({
  selector: 'app-csa-dot-plot',
  standalone: true,
  imports: [CommonModule, VicXyChartModule],
  templateUrl: './csa-dot-plot.component.html',
  styleUrl: './csa-dot-plot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsaDotPlotComponent implements OnInit {
  @Input() data: EnergyIntensityDatum[];
  chartHeight = 600;

  ngOnInit(): void {
    console.log('CSA dot plot data:', this.data);
  }
}
