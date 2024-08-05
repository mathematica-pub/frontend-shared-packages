import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComboboxService } from '../combobox.service';

@Component({
  standalone: true,
  selector: 'hsi-ui-combobox-label',
  template: `<ng-template
    ><p class="combobox-label" [id]="service.comboboxLabelId">
      <ng-content></ng-content></p
  ></ng-template>`,
})
export class ComboboxLabelComponent implements AfterViewInit {
  @ViewChild(TemplateRef) labelContent: TemplateRef<unknown>;

  constructor(public service: ComboboxService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.service.setLabel(this);
    }, 0);
  }
}
