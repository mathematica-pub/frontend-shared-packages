import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-geographies-documentation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './geographies-documentation.component.html',
  styleUrl: './geographies-documentation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeographiesDocumentationComponent { }
