import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notes',
  standalone: true,
  templateUrl: 'notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  @Input() directionality: string;
  @Input() units: string;
}
