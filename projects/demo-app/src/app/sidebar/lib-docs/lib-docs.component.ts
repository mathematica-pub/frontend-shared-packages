import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UndasherizePipe } from '../../core/pipes/undasherize.pipe';
import { FileResource } from '../../core/resources/file.resource';
import {
  DirectoryComponent,
  NewDirectoryItem,
} from './directory/directory.component';
import {
  DirectoryItem,
  DocsDirectory,
  DocsItem,
  NestedStringObject,
} from './docs-directory/docs';
import { DocsDirectoryComponent } from './docs-directory/docs-directory.component';
import { Library } from './libraries';

@Component({
  selector: 'app-lib-docs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UndasherizePipe,
    DocsDirectoryComponent,
    DirectoryComponent,
    TitleCasePipe,
  ],
  providers: [TitleCasePipe],
  templateUrl: './lib-docs.component.html',
  styleUrls: ['./lib-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDocsComponent implements OnInit {
  @Input() lib: { displayName: string; id: Library };
  @ViewChild(DocsDirectoryComponent)
  documentationDirectory: DocsDirectoryComponent;
  automatedDocumentation$: Observable<DocsItem[]>;
  automatedDocumentation2$: Observable<NewDirectoryItem[]>;
  manualDocumentation$: Observable<{ title: string; items: string[] }>;
  automatedDocsPath = '/documentation';
  expanded = true;
  private files = inject(FileResource);

  constructor(
    private titleCase: TitleCasePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initManualDocumentation();
    this.initAutomatedDocumentation();
  }

  initManualDocumentation(): void {
    const path = `app/manual-documentation/${this.lib.id}/config.yaml`;
    this.manualDocumentation$ = this.files.getYamlFile(path);
  }

  initAutomatedDocumentation(): void {
    const path = `assets/documentation/${this.lib.id}/documentation-structure.yaml`;
    this.automatedDocumentation$ = this.files.getYamlFile(path).pipe(
      map((yamlObject) => {
        console.log(yamlObject);
        const tree = this.getDocumentationTree(yamlObject);
        console.log(tree);
        return tree;
      })
    );
    this.automatedDocumentation2$ = this.files.getYamlFile(path).pipe(
      map((yamlObject) => {
        console.log(yamlObject);
        const tree = this.getDocumentationDirectories(yamlObject);
        console.log(tree);
        return tree;
      })
    );
  }

  getDocumentationTree(
    yaml: NestedStringObject,
    level: number = 0
  ): DocsDirectory[] {
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

    return returnArray as DocsDirectory[];
  }

  getDocumentationDirectories(
    yaml: NestedStringObject,
    level: number = 0
  ): NewDirectoryItem[] {
    const returnArray = Object.entries(yaml).map(([key, value]) => {
      if (typeof value === 'string') {
        return {
          name: this.creteDisplayName(key),
          value: key,
        };
      } else {
        return {
          name: this.creteDisplayName(key),
          value: key,
          children: this.getDocumentationDirectories(value, level + 1),
          type: DirectoryItem.Directory,
        };
      }
    });

    // Documentation structure doc determines the order for the top level
    if (level !== 0) {
      returnArray.sort((a, b) => {
        if (!a.children && !!b.children) return 1;
        if (!!a.children && !b.children) return -1;
        return a.name.localeCompare(b.name);
      });
    }

    return returnArray as NewDirectoryItem[];
  }

  creteDisplayName(str: string): string {
    return this.titleCase.transform(str.replace(/-/g, ' '));
  }

  selectAutomatedDocsItem(item: string): void {
    console.log('selectedItem', item);
  }
  selectAutomatedDocsPath(item: string): void {
    console.log('activePath', item);
  }

  toggleLibrary(): void {
    this.expanded = !this.expanded;
  }
}
