import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SingleDisplayComponent } from '../../example-display/single-display/single-display.component';
import { BasicLinesComponent } from './basic-lines/basic-lines.component';

@Component({
  selector: 'app-lines-example',
  standalone: true,
  imports: [CommonModule, SingleDisplayComponent, BasicLinesComponent],
  templateUrl: './lines-example.component.html',
  styleUrls: ['../examples.scss', './lines-example.component.scss'],
})
export class LinesExampleComponent {}
