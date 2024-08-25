import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';

@Component({
  selector: 'app-example-a',
  standalone: true,
  imports: [CommonModule, ExportContentComponent],
  templateUrl: './example-a.component.html',
  styleUrls: ['./example-a.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleAComponent {}
