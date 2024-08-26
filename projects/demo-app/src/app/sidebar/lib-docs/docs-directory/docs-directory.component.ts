import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UndasherizePipe } from '../../../core/pipes/undasherize.pipe';
import { DirectoryItem, DocsItem } from './docs';

@Component({
  selector: 'app-docs-directory',
  standalone: true,
  imports: [CommonModule, RouterModule, UndasherizePipe],
  templateUrl: './docs-directory.component.html',
  styleUrls: ['./docs-directory.component.scss'],
})
export class DocsDirectoryComponent {
  @Input() items: DocsItem[];
  @Input() docPath: string;
  @Input() level: number = 0;
  @ViewChild(DocsDirectoryComponent) child: DocsDirectoryComponent;
  selected = {};
  DirItem = DirectoryItem;

  toggleSelected(key: string): void {
    if (this.selected[key] === undefined) {
      this.selected[key] = true;
    } else {
      this.selected[key] = !this.selected[key];
    }
  }

  getDocPathForLevel(key: string): string {
    return `${this.docPath}/${key}`;
  }

  closeAll(): void {
    Object.keys(this.selected).forEach((key) => {
      this.selected[key] = false;
    });
    this.child?.closeAll();
  }
}
