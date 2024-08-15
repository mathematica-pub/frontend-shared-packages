import { CommonModule } from '@angular/common';
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
import { UndasherizePipe } from '../../core/pipes/undasherize.pipe';
import { FileResource } from '../../core/resources/file.resource';
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
  ],
  templateUrl: './lib-docs.component.html',
  styleUrls: ['./lib-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibDocsComponent implements OnInit {
  @Input() lib: { displayName: string; id: Library };
  @ViewChild(DocsDirectoryComponent)
  documentationDirectory: DocsDirectoryComponent;
  automatedDocumentation$: Observable<DocsItem[]>;
  manualDocumentation$: Observable<{ title: string; items: string[] }>;
  automatedDocsPath = '/documentation';
  expanded = true;
  private files = inject(FileResource);

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
        const tree = this.getDocumentationTree(yamlObject);
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

  closeAllDocumentation(): void {
    this.documentationDirectory?.closeAll();
  }

  toggleLibrary(): void {
    this.expanded = !this.expanded;
  }
}
