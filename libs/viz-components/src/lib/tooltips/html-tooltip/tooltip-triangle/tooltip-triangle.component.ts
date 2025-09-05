import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vic-tooltip-triangle',
  imports: [],
  templateUrl: './tooltip-triangle.component.html',
  styleUrl: './tooltip-triangle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TooltipTriangleComponent {
  @Input() height: number = 12;
  @Input() width: number = 20;
}
