import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { parse } from 'yaml';
import {
  DirectoryItem,
  NavbarDirectory,
  NavbarItem,
  NestedStringObject,
} from '../core/models/navbar';
import { UndasherizePipe } from '../core/pipes/undasherize.pipe';
import { DirectoryComponent } from '../navbar-directory/navbar-directory.component';
import { Lib } from './libraries';

@Component({
  selector: 'app-lib-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, UndasherizePipe],
  templateUrl: './lib-docs.component.html',
  styleUrls: ['./lib-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDocsComponent implements OnInit {
  @Input() lib: keyof typeof Lib;
  @Input() examples: string[];
  @ViewChild(DirectoryComponent)
  documentationDirectory: DirectoryComponent;
  documentationTree$: Observable<NavbarItem[]>;
  baseFolder = '/documentation';
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.documentationTree$ = this.http
      .get('assets/documentation/viz-components/documentation-structure.yaml', {
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
  ): NavbarDirectory[] {
    const returnArray = Object.entries(yaml).map(([key, value]) => {
      if (typeof value === 'string') {
        return {
          name: key,
          contents: value,
          type: DirectoryItem.File,
        };
      } else {
        return {
          name: key,
          contents: this.getDocumentationTree(value, level + 1),
          type: DirectoryItem.Directory,
        };
      }
    });

    // Documentation structure doc determines the order for the top level
    if (level !== 0) {
      returnArray.sort((a, b) => {
        if (a.type === DirectoryItem.File && b.type === DirectoryItem.Directory)
          return 1;
        if (a.type === DirectoryItem.Directory && b.type === DirectoryItem.File)
          return -1;
        return a.name.localeCompare(b.name);
      });
    }

    return returnArray as NavbarDirectory[];
  }

  closeAllDocumentation(): void {
    this.documentationDirectory?.closeAll();
  }
}
