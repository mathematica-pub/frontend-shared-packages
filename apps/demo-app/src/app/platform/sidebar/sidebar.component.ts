import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Library, Section } from '../../core/services/router-state/state';
import { LibDocsComponent } from './lib-docs/lib-docs.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LibDocsComponent],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  Library = Library;
  Section = Section;
  public routerState = inject(RouterStateService);

  selectOverview(): void {
    this.routerState.update({
      section: Section.Overview,
      lib: Library.SharedPackages,
    });
  }
}
