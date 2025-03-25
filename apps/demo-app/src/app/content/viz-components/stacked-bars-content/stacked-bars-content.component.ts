import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFilesService } from '../../../core/services/content-files.service';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { StackedBarsExampleComponent } from './stacked-bars-example/stacked-bars-example.component';

@Component({
  selector: 'app-stacked-bars-content',
  imports: [
    CommonModule,
    SplitPanelExampleDisplayComponent,
    StackedBarsExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './stacked-bars-content.component.html',
  styleUrls: ['../../examples.scss', './stacked-bars-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedBarsContentComponent {
  constructor(public content: ContentFilesService) {}
}
