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
import { NavbarFolderComponent } from '../navbar-folder/navbar-folder.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarFolderComponent, UndasherizePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild(NavbarFolderComponent) child: NavbarFolderComponent;
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const yamlObject: any = parse(text);
          return this.getDocumentationTree(yamlObject);
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDocumentationTree(yaml: NestedStringObject): NavbarFolder[] {
    const returnArray = Object.entries(yaml)
      .map(([key, value]) => {
        return {
          name: key,
          contents: value,
          type: typeof value === 'string' ? DirItem.File : DirItem.Folder,
        };
      })
      .sort((a, b) => {
        if (a.type === DirItem.File && b.type === DirItem.Folder) return 1;
        if (a.type === DirItem.Folder && b.type === DirItem.File) return -1;
        return a.name.localeCompare(b.name);
      });

    const folderStructure = returnArray
      .filter((entry) => entry.type === DirItem.Folder)
      .map((entry) => {
        return {
          name: entry.name,
          type: DirItem.Folder,
          contents: this.getDocumentationTree(
            entry.contents as NestedStringObject
          ),
        };
      });
    return folderStructure as NavbarFolder[];
  }

  closeAllDocumentation(): void {
    this.child?.closeAll();
  }
}
