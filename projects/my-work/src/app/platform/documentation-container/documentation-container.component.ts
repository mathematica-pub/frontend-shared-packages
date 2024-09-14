import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationDisplayComponent } from 'projects/app-dev-kit/src/public-api';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Section } from '../../core/services/router-state/state';

@Component({
  selector: 'app-documentation-container',
  standalone: true,
  imports: [CommonModule, DocumentationDisplayComponent],
  templateUrl: './documentation-container.component.html',
  styleUrl: './documentation-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentationContainerComponent {
  constructor(private routerState: RouterStateService) {}

  navigateToDoc(path: string): void {
    this.routerState.update({ section: Section.Docs, contentPath: path });
  }
}
