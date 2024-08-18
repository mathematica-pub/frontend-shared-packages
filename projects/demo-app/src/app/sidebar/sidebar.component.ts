import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterStateService } from '../core/services/router-state/router-state.service';
import { Library, Section } from '../core/services/router-state/state';
import {
  DirectoryComponent,
  DirectorySelection,
} from './lib-docs/directory/directory.component';
import { LibDocsComponent } from './lib-docs/lib-docs.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LibDocsComponent, DirectoryComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  Library = Library;
  Section = Section;

  constructor(public routerState: RouterStateService) {}

  selectOverview(): void {
    this.routerState.update({
      section: Section.Overview,
      lib: Library.SharedPackages,
    });
  }

  logItem(item: DirectorySelection): void {
    console.log('Item selected:', item);
  }
}
