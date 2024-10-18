import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isEqual } from 'lodash-es';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
} from 'rxjs';
import { Library, Section, State } from './state';

@Injectable({
  providedIn: 'root',
})
export class RouterStateService {
  state$: Observable<State>;

  constructor(private router: Router) {}

  initialize() {
    this.setStateObservable();
  }

  private setStateObservable() {
    const url$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).url),
      distinctUntilChanged((prev, curr) => isEqual(prev, curr))
    );

    this.state$ = url$.pipe(
      map((url) => this.getStateFromUrl(url)),
      shareReplay(1)
    );
  }

  getStateFromUrl(url: string): State {
    const subdirectories = url.split('/');
    if (subdirectories.every((f) => !f)) {
      // site will load before router redirect has taken place, so help this along by redirecting to default if no subdirectories in url
      // state-based styles won't load on first load if we don't do this
      return {
        lib: Library.SharedPackages,
        section: Section.Overview,
        contentPath: '',
      };
    }
    return {
      lib: subdirectories[1] as Library,
      section: subdirectories[2] as Section,
      contentPath: subdirectories.slice(3).join('/'),
    };
  }

  update(update: Partial<State>): void {
    let paths = [`/${update.lib}`, update.section];
    if (update.contentPath) {
      const contentPath = update.contentPath.split('/');
      paths = [...paths, ...contentPath];
    }
    this.router.navigate(paths);
  }
}
