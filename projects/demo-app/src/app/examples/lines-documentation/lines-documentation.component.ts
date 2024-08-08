import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lines-documentation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './lines-documentation.component.html',
  styleUrl: './lines-documentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesDocumentationComponent { }
