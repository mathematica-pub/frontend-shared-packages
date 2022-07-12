import { Component, Input } from '@angular/core';
import { DataMarksComponentCard } from '../../core/models/component-card';

@Component({
  selector: 'app-component-card',
  templateUrl: './component-card.component.html',
  styleUrls: ['./component-card.component.scss'],
})
export class ComponentCardComponent {
  @Input() component: DataMarksComponentCard;
}
