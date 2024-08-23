import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterStateService } from '../core/services/router-state/router-state.service';
import { Section } from '../core/services/router-state/state';
import { DirectoryComponent } from './directory/directory.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectoryComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  Section = Section;

  constructor(public routerState: RouterStateService) {}

  selectOverview(): void {}
}
