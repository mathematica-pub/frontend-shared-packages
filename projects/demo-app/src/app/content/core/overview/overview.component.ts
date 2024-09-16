import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import { AdkDocumentationDisplayComponent } from 'projects/app-dev-kit/src/public-api';
import { Observable, combineLatest, filter, map, of } from 'rxjs';
import { ContentConfigService } from '../../../core/services/content-config.service';
import { RouterStateService } from '../../../core/services/router-state/router-state.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, AdkDocumentationDisplayComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent implements OnInit {
  contentPath$: Observable<string>;
  fileConfig$: Observable<Record<string, string>>;

  constructor(
    public routerState: RouterStateService,
    public configService: ContentConfigService
  ) {}

  ngOnInit(): void {
    this.setFileConfig();
    this.setContentPath();
  }

  setFileConfig(): void {
    this.fileConfig$ = combineLatest([
      this.configService.config$.pipe(filter((config) => !!config)),
      this.routerState.state$.pipe(map((state) => state.lib)),
    ]).pipe(
      map(([config, lib]) => {
        return { overview: config[lib].overview };
      })
    );
  }

  setContentPath(): void {
    this.contentPath$ = of('overview');
  }
}
