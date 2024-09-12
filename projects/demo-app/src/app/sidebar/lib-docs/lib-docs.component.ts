import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  DirectoryComponent,
  DirectoryItem,
  DirectorySelection,
} from 'projects/ui-components/src/public-api';
import { filter, map, Observable } from 'rxjs';
import {
  getContentConfigForLib,
  getDocumentationConfigForLib,
} from '../../core/constants/file-paths.constants';
import { AssetsService } from '../../core/services/assets.service';
import { RouterStateService } from '../../core/services/router-state/router-state.service';
import { Library, Section } from '../../core/services/router-state/state';

type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

type ContentConfig = {
  title: string;
  items: NestedStringObject;
};

type ContentDocs = {
  title: string;
  items: DirectoryItem[];
};

@Component({
  selector: 'app-lib-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, DirectoryComponent, TitleCasePipe],
  providers: [TitleCasePipe],
  templateUrl: './lib-docs.component.html',
  styleUrls: ['./lib-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LibDocsComponent implements OnInit {
  @Input() lib: { displayName: string; id: Library };
  automatedDocsItems$: Observable<DirectoryItem[]>;
  manualDocs$: Observable<ContentDocs>;
  expanded = true;
  Section = Section;
  Library = Library;

  constructor(
    private titleCase: TitleCasePipe,
    public routerState: RouterStateService,
    private assets: AssetsService
  ) {}

  ngOnInit(): void {
    this.initManualDocumentation();
    this.initAutomatedDocumentation();
  }

  initManualDocumentation(): void {
    const configPath = getContentConfigForLib(this.lib.id);
    this.manualDocs$ = this.assets
      .getAsset<ContentConfig>(configPath, 'yaml')
      .pipe(
        filter((manualConfig) => !!manualConfig),
        map((manualConfig) => ({
          title: manualConfig.title,
          items: this.getDocsDirectoryTree(manualConfig.items),
        }))
      );
  }

  initAutomatedDocumentation(): void {
    const configPath = getDocumentationConfigForLib(this.lib.id);
    this.automatedDocsItems$ = this.assets
      .getAsset<NestedStringObject>(configPath, 'yaml')
      .pipe(
        filter((automatedConfig) => !!automatedConfig),
        map((automatedConfig) => this.getDocsDirectoryTree(automatedConfig))
      );
  }

  getDocsDirectoryTree(
    yaml: NestedStringObject,
    level: number = 0
  ): DirectoryItem[] {
    let itemsArray;
    if (Array.isArray(yaml)) {
      itemsArray = yaml.map((item) => this.createFlatItem(item));
    } else {
      itemsArray = Object.entries(yaml).map(([key, value]) => {
        if (typeof value === 'string') {
          return this.createFlatItem(key);
        } else {
          return {
            name: this.createDisplayName(key),
            value: key,
            children: this.getDocsDirectoryTree(value, level + 1),
          };
        }
      });
    }
    // Documentation structure doc determines the order for the top level
    if (level !== 0) {
      itemsArray.sort((a, b) => {
        if (!a.children && !!b.children) return 1;
        if (!!a.children && !b.children) return -1;
        return a.name.localeCompare(b.name);
      });
    }

    return itemsArray as DirectoryItem[];
  }

  createFlatItem(key: string): DirectoryItem {
    return {
      name: this.createDisplayName(key),
      value: key,
    };
  }

  createDisplayName(str: string): string {
    return this.titleCase.transform(str.replace(/-/g, ' '));
  }

  selectLibOverview(): void {
    this.routerState.update({
      lib: this.lib.id,
      section: Section.Overview,
      contentPath: '',
    });
  }

  selectAutomatedDocsItem(item: DirectorySelection): void {
    this.routerState.update({
      lib: this.lib.id,
      section: Section.Documentation,
      contentPath: item.activePath,
    });
  }

  selectManualDocsItem(item: DirectorySelection): void {
    this.routerState.update({
      lib: this.lib.id,
      section: Section.Content,
      contentPath: item.activePath,
    });
  }

  toggleLibrary(): void {
    this.expanded = !this.expanded;
  }
}
