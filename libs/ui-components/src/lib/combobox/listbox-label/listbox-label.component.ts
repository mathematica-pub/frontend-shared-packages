import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ComboboxService } from '../combobox.service';

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-listbox-label',
  templateUrl: './listbox-label.component.html',
  styleUrls: ['./listbox-label.component.scss'],
  host: {
    class: 'hsi-ui-listbox-label',
  },
  standalone: false,
})
export class ListboxLabelComponent {
  @ViewChild('label') labelContent: TemplateRef<unknown>;
  @ViewChild('text') label: ElementRef<HTMLParagraphElement>;
  id: string;

  constructor(private service: ComboboxService) {
    this.id = `${this.service.id}-listbox-label-${nextUniqueId++}`;
  }
}
