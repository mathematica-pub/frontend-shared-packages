import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DirectoryComponent } from './lib-docs/directory/directory.component';
import { LibDocsComponent } from './lib-docs/lib-docs.component';
import { Library } from './lib-docs/libraries';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LibDocsComponent, DirectoryComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  Library = Library;

  logItem(item: string): void {
    console.log('Item selected:', item);
  }
}
