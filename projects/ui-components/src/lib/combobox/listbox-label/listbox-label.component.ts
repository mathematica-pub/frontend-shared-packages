import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ComboboxService } from '../combobox.service';

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-listbox-label',
  template: `<ng-template #label>
    <p class="listbox-label" [id]="id" role="presentation" #text
      ><ng-content></ng-content
    ></p>
  </ng-template>`,
  styles: [],
})
export class ListboxLabelComponent {
  @ViewChild('label') labelContent: TemplateRef<unknown>;
  @ViewChild('text') label: ElementRef<HTMLParagraphElement>;
  id: string;

  constructor(private service: ComboboxService) {
    this.id = `${this.service.id}-listbox-label-${nextUniqueId++}`;
  }
}
