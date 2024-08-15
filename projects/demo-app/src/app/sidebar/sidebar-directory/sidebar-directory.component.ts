import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UndasherizePipe } from '../../core/pipes/undasherize.pipe';
import { DirectoryItem, SidebarItem } from './sidebar-directory';

@Component({
  selector: 'app-sidebar-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, UndasherizePipe],
  templateUrl: './sidebar-directory.component.html',
  styleUrls: ['./sidebar-directory.component.scss'],
})
export class SidebarDirectoryComponent {
  @Input() items: SidebarItem[];
  @Input() itemPath: string;
  @Input() level: number = 0;
  @ViewChild(SidebarDirectoryComponent) child: SidebarDirectoryComponent;
  selected = {};
  DirItem = DirectoryItem;

  toggleSelected(key: string): void {
    if (this.selected[key] === undefined) {
      this.selected[key] = true;
    } else {
      this.selected[key] = !this.selected[key];
    }
  }

  getItemPathForLevel(key: string): string {
    return `${this.itemPath}/${key}`;
  }

  closeAll(): void {
    Object.keys(this.selected).forEach((key) => {
      this.selected[key] = false;
    });
    this.child?.closeAll();
  }
}
