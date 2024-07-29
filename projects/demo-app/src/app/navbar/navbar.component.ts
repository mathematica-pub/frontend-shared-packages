import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { parse } from 'yaml';
import { EXAMPLES } from '../core/constants/examples.constants';
import { Example } from '../core/models/example';
import { NavbarItem, NestedStringObject } from '../core/models/navbar';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  documentationTree$: Observable<any>;
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
  getDocumentationTree(yaml: NestedStringObject): NavbarItem[] {
    const returnArray = Object.entries(yaml)
      .map(([key, value]) => {
        return {
          name: key,
          contents: value,
          isFile: typeof value === 'string',
        };
      })
      .sort((a, b) => {
        if (a.isFile && !b.isFile) return 1;
        if (!a.isFile && b.isFile) return -1;
        return a.name.localeCompare(b.name);
      });

    const folderStructure = returnArray
      .filter((entry) => !entry.isFile)
      .map((entry) => {
        return {
          ...entry,
          contents: this.getDocumentationTree(
            entry.contents as NestedStringObject
          ),
        };
      });
    return folderStructure;
  }
}
