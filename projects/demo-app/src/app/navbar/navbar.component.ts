import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { parse } from 'yaml';
import { EXAMPLES } from '../core/constants/examples.constants';
import { Example } from '../core/models/example';
import {
  DirItem,
  NavbarFolder,
  NavbarItem,
  NestedStringObject,
} from '../core/models/navbar';
import { UndasherizePipe } from '../core/pipes/undasherize.pipe';
import { NavbarDirectoryComponent } from '../navbar-directory/navbar-directory.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarDirectoryComponent,
    UndasherizePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild(NavbarDirectoryComponent)
  documentationDirectory: NavbarDirectoryComponent;
  documentationTree$: Observable<NavbarItem[]>;
  examples: Example[] = EXAMPLES;
  baseFolder = '/documentation';

  private http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    this.documentationTree$ = this.http
      .get('assets/documentation/documentation-structure.yaml', {
        responseType: 'text',
      })
      .pipe(
        map((text) => {
          const yamlObject = parse(text);
          const tree = this.getDocumentationTree(yamlObject);
          return tree;
        })
      );
  }

  getDocumentationTree(
    yaml: NestedStringObject,
    level: number = 0
  ): NavbarFolder[] {
    const returnArray = Object.entries(yaml).map(([key, value]) => {
      if (typeof value === 'string') {
        return {
          name: key,
          contents: value,
          type: DirItem.File,
        };
      } else {
        return {
          name: key,
          contents: this.getDocumentationTree(value, level + 1),
          type: DirItem.Folder,
        };
      }
    });

    // Documentation structure doc should determine the order for the top level
    if (level !== 0) {
      returnArray.sort((a, b) => {
        if (a.type === DirItem.File && b.type === DirItem.Folder) return 1;
        if (a.type === DirItem.Folder && b.type === DirItem.File) return -1;
        return a.name.localeCompare(b.name);
      });
    }

    return returnArray as NavbarFolder[];
  }

  closeAllDocumentation(): void {
    this.documentationDirectory?.closeAll();
  }
}
