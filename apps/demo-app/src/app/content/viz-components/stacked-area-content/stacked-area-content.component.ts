import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFilesService } from '../../../core/services/content-files.service';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { StackedAreaExampleComponent } from './stacked-area-example/stacked-area-example.component';

@Component({
  selector: 'app-stacked-area-content',
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    StackedAreaExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './stacked-area-content.component.html',
  styleUrls: ['../../examples.scss', './stacked-area-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedAreaContentComponent {
  constructor(public content: ContentFilesService) {}
}
