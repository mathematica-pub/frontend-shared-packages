import { Component } from '@angular/core';
import { dataMarksComponentCards } from '../../core/constants/component-card.constants';
import { DataMarksComponentCard } from '../../core/models/component-card';

@Component({
  selector: 'app-component-cards-display',
  templateUrl: './component-cards-display.component.html',
  styleUrls: ['./component-cards-display.component.scss'],
})
export class ComponentCardsDisplayComponent {
  dataMarksComponents: DataMarksComponentCard[] = dataMarksComponentCards;
}
