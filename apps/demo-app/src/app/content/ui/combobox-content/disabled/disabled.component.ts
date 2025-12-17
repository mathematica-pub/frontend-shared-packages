import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-disabled',
  imports: [],
  templateUrl: './disabled.html',
  styleUrl: './disabled.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disabled { }
