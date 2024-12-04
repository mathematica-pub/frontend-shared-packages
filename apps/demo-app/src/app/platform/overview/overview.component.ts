import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import {
  AdkAssetResponse,
  AdkAssetsService,
  AdkMarkdownParser,
  AdkParsedContentSection,
  ShikiTheme,
} from '@hsi/app-dev-kit';
import { distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { RouterStateService } from '../../core/services/router-state/router-state.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit {
  // passed in with routerBinding;
  @Input() lib: string;
  content$: Observable<AdkParsedContentSection[]>;
  route: string;

  constructor(
    private routerState: RouterStateService,
    private assets: AdkAssetsService,
    private markdown: AdkMarkdownParser
  ) {}

  ngOnInit(): void {
    this.setHtml();
  }

  setHtml(): void {
    this.content$ = this.routerState.state$.pipe(
      map((state) => state.lib),
      map((lib) => `${lib}/content/overview.md`),
      distinctUntilChanged(),
      switchMap((filePath) =>
        this.assets.getAsset(filePath, AdkAssetResponse.Text)
      ),
      switchMap((raw) => {
        return this.markdown.parse(raw as string, {
          highlighter: { type: 'markdown', theme: ShikiTheme.CatppuccinLatte },
        });
      })
    );
  }
}
