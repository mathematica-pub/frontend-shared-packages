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
    const str = `${this.baseString}/${key}`;
    console.log(str);
    return str;
  }

  getArrow(key: string): string {
    if (this.selected[key] === undefined || this.selected[key] == false) {
      return 'arrow-down';
    }
    return 'arrow-up';
  }
}
