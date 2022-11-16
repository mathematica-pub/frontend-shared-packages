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
  arrow = {};
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
  setArrowUpIfSelected(key: string): void {
    if (this.selected[key] === true) this.arrow[key] = 'arrow-up';
  }
  setArrowDown(key: string): void {
    this.arrow[key] = 'arrow-down';
  }
  getArrow(key: string): string {
    if (this.arrow[key] === undefined) {
      this.arrow[key] = 'arrow-down';
    }
    return this.arrow[key];
  }
}
