import {
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

let nextUniqueId = 0;

@Component({
  selector: 'hsi-ui-tab-label',
  template: `<ng-template
    ><div #label class="tab-label" [id]="id"><ng-content></ng-content></div
  ></ng-template>`,
  standalone: true,
})
export class TabLabelComponent {
  @Input() value: string;
  @ViewChild('label')
  labelElement: ElementRef<HTMLDivElement>;
  @ViewChild(TemplateRef) labelContent: TemplateRef<unknown>;
  id = `tab-label-${nextUniqueId++}`;
}
