import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-energy-intensity-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './energy-intensity-line.component.html',
  styleUrls: ['./energy-intensity-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyIntensityLineComponent {}
