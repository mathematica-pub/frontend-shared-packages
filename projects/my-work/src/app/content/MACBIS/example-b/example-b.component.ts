import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExportContentComponent } from '../../../platform/export-content/export-content.component';

@Component({
  selector: 'app-example-b',
  standalone: true,
  imports: [CommonModule, ExportContentComponent],
  templateUrl: './example-b.component.html',
  styleUrls: ['./example-b.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleBComponent {}
