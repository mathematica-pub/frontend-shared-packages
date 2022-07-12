import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentCardComponent } from './component-card/component-card.component';
import { ComponentCardsDisplayComponent } from './component-cards-display/component-cards-display.component';
import { StartRoutingModule } from './start-routing.module';
import { StartComponent } from './start.component';

@NgModule({
  declarations: [
    StartComponent,
    ComponentCardComponent,
    ComponentCardsDisplayComponent,
  ],
  imports: [CommonModule, StartRoutingModule],
})
export class StartModule {}
