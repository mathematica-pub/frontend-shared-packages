import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar-folder',
  templateUrl: './navbar-folder.component.html',
  styleUrls: ['./navbar-folder.component.scss'],
})
export class NavbarFolderComponent {
  @Input() links;
  @Input() baseString;
  selected = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
