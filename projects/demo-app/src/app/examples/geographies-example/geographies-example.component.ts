import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SingleDisplayComponent } from '../../example-display/single-display/single-display.component';
import { BasicGeographiesComponent } from './basic-geographies/basic-geographies.component';

@Component({
  selector: 'app-geographies-example',
  standalone: true,
  imports: [CommonModule, SingleDisplayComponent, BasicGeographiesComponent],
  templateUrl: './geographies-example.component.html',
  styleUrls: ['../examples.scss', './geographies-example.component.scss'],
})
export class GeographiesExampleComponent {}
