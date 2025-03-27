import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { QuantitativeRulesComponent } from './quantitative-rules.component';

@NgModule({
  imports: [CommonModule, QuantitativeRulesComponent],
  exports: [QuantitativeRulesComponent],
})
export class VicQuantitativeRulesModule {}
