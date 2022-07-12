import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StartRoutingModule } from './start-routing.module';
import { StartComponent } from './start.component';
import { ComponentCardComponent } from './component-card/component-card.component';
import { ComponentCardsDisplayComponent } from './component-cards-display/component-cards-display.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [StartComponent, ComponentCardComponent, ComponentCardsDisplayComponent, NavbarComponent],
  imports: [CommonModule, StartRoutingModule],
})
export class StartModule {}
