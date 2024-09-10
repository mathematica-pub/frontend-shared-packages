import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-table-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-content.component.html',
  styleUrl: './table-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContentComponent {}
