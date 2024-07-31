import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SplitDisplayComponent } from '../../example-display/split-display/split-display.component';
import { BasicStackedAreaComponent } from './basic-stacked-area/basic-stacked-area.component';

@Component({
  selector: 'app-stacked-area-example',
  standalone: true,
  imports: [CommonModule, SplitDisplayComponent, BasicStackedAreaComponent],
  templateUrl: './stacked-area-example.component.html',
  styleUrls: ['../examples.scss', './stacked-area-example.component.scss'],
})
export class StackedAreaExampleComponent {}
