import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdkAssetResponse, AdkAssetsService } from '@hsi/app-dev-kit';
import {
  HsiUiDirectoryComponent,
  HsiUiDirectoryItem,
  HsiUiDirectorySelection,
} from '@hsi/ui-components';
import { filter, map, Observable, tap } from 'rxjs';
import { getDocumentationConfigForLib } from '../../../core/constants/file-paths.constants';
import { ContentConfigService } from '../../../core/services/content-config.service';
import { RouterStateService } from '../../../core/services/router-state/router-state.service';
import { Library, Section } from '../../../core/services/router-state/state';

type NestedStringObject = {
  [key: string]: string | NestedStringObject;
};

type ContentDocs = {
  title: string;
  items: HsiUiDirectoryItem[];
};

@Component({
  selector: 'app-lib-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, HsiUiDirectoryComponent, TitleCasePipe],
  providers: [TitleCasePipe],
  templateUrl: './lib-docs.component.html',
  styleUrls: ['./lib-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LibDocsComponent implements OnInit {
  @Input() lib: { displayName: string; id: Library };
  @Input() expanded = true;
  automatedDocsItems$: Observable<HsiUiDirectoryItem[]>;
  manualDocs$: Observable<ContentDocs>;
  Section = Section;
  Library = Library;

  constructor(
    private titleCase: TitleCasePipe,
    public routerState: RouterStateService,
    private assets: AdkAssetsService,
    private configService: ContentConfigService
  ) {}

  ngOnInit(): void {
    this.initManualDocumentation();
    this.initAutomatedDocumentation();
  }

  initManualDocumentation(): void {
    this.manualDocs$ = this.configService.config$.pipe(
      filter((siteConfig) => !!siteConfig && !!siteConfig[this.lib.id].items),
      map((siteConfig) => siteConfig[this.lib.id]),
      map((libConfig) => {
        return {
          title: libConfig.title,
          items: this.getDocsDirectoryTree(libConfig.items),
        };
      })
    );
  }

  initAutomatedDocumentation(): void {
    const configPath = getDocumentationConfigForLib(this.lib.id);
    this.automatedDocsItems$ = this.assets
      .getAsset(configPath, AdkAssetResponse.Text)
      .pipe(
        map((str) => this.assets.parseYaml<NestedStringObject>(str as string)),
        filter((automatedConfig) => !!automatedConfig),
        map((automatedConfig) => this.getDocsDirectoryTree(automatedConfig)),
        tap((items) => console.log('items', items))
      );
  }

  getDocsDirectoryTree(
    yaml: NestedStringObject,
    level: number = 0
  ): HsiUiDirectoryItem[] {
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

    return itemsArray as HsiUiDirectoryItem[];
  }

  createFlatItem(key: string): HsiUiDirectoryItem {
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

  selectAutomatedDocsItem(item: HsiUiDirectorySelection): void {
    this.routerState.update({
      lib: this.lib.id,
      section: Section.Documentation,
      contentPath: item.activePath,
    });
  }

  selectManualDocsItem(item: HsiUiDirectorySelection): void {
    console.log('item', item);
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
