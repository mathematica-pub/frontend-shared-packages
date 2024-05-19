import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UndasherizePipe } from '../core/pipes/undasherize.pipe';

@Component({
  selector: 'app-navbar-folder',
  standalone: true,
  imports: [CommonModule, RouterModule, UndasherizePipe],
  templateUrl: './navbar-folder.component.html',
  styleUrls: ['./navbar-folder.component.scss'],
})
export class NavbarFolderComponent {
  @Input() links;
  @Input() baseString;
  selected = {};

  linkIsString(link: any): boolean {
    return typeof link === 'string';
  }

  toggleSelected(key: string): void {
    if (this.selected[key] === undefined) {
      this.selected[key] = true;
    } else {
      this.selected[key] = !this.selected[key];
    }
  }

  addPartToBaseString(key: any): string {
    return `${this.baseString}/${key}`;
  }

  getArrow(key: string): string {
    if (this.selected[key] === undefined || this.selected[key] == false) {
      return 'arrow-down';
    }
    return 'arrow-up';
  }
}
