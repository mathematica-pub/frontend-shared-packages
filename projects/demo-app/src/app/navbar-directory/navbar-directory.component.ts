import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DirectoryItem, NavbarItem } from '../core/models/navbar';
import { UndasherizePipe } from '../core/pipes/undasherize.pipe';

@Component({
  selector: 'app-navbar-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, UndasherizePipe],
  templateUrl: './navbar-directory.component.html',
  styleUrls: ['./navbar-directory.component.scss'],
})
export class NavbarDirectoryComponent {
  @Input() items: NavbarItem[];
  @Input() baseString;
  @Input() level: number = 0;
  @ViewChild(NavbarDirectoryComponent) child: NavbarDirectoryComponent;
  selected = {};
  DirItem = DirectoryItem;

  toggleSelected(key: string): void {
    if (this.selected[key] === undefined) {
      this.selected[key] = true;
    } else {
      this.selected[key] = !this.selected[key];
    }
  }

  addPartToBaseString(key: string): string {
    return `${this.baseString}/${key}`;
  }

  closeAll(): void {
    Object.keys(this.selected).forEach((key) => {
      this.selected[key] = false;
    });
    this.child?.closeAll();
  }
}
