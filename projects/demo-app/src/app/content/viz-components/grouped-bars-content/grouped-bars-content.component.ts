import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentFilesService } from '../../../core/services/content-files.service';
import { SinglePanelExampleDisplayComponent } from '../../../platform/single-panel-example-display/single-panel-example-display.component';
import { SplitPanelExampleDisplayComponent } from '../../../platform/split-panel-example-display/split-panel-example-display.component';
import { ContentContainerComponent } from '../../content-container/content-container.component';
import { GroupedBarsExampleComponent } from './grouped-bars-example/grouped-bars-example.component';

@Component({
  selector: 'app-grouped-bars-content',
  standalone: true,
  imports: [
    CommonModule,
    SinglePanelExampleDisplayComponent,
    SplitPanelExampleDisplayComponent,
    GroupedBarsExampleComponent,
    ContentContainerComponent,
  ],
  templateUrl: './grouped-bars-content.component.html',
  styleUrls: ['../../examples.scss', './grouped-bars-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedBarsContentComponent {
  constructor(public content: ContentFilesService) {}
}
