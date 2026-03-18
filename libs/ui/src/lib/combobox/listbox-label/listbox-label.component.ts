import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ComboboxService } from '../combobox.service';

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-listbox-label',
  imports: [CommonModule],
  templateUrl: './listbox-label.component.html',
  styleUrls: ['./listbox-label.component.scss'],
  host: {
    class: 'hsi-ui-listbox-label',
  },
})
export class ListboxLabelComponent {
  @ViewChild('label') labelContent: TemplateRef<unknown>;
  @ViewChild('text') label: ElementRef<HTMLParagraphElement>;
  id: string;
  private service = inject(ComboboxService);

  constructor() {
    this.id = `${this.service.id}-listbox-label-${nextUniqueId++}`;
  }
}
