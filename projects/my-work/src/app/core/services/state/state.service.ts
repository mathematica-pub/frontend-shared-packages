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
import { Section, State } from './state';

@Injectable({
  providedIn: 'root',
})
export class StateService {
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
    const fragments = url.split('/');
    if (fragments.every((f) => !f)) {
      // site will load before router redirect has taken place, so help this along by redirecting to default if no fragments in url
      // state-based styles won't load on first load if we don't do this
      return {
        section: Section.Docs,
        contentPath: 'about-this-app',
      };
    }
    return {
      section: fragments[1] as Section,
      contentPath: fragments.slice(2).join('/'),
    };
  }

  // full content path is always required in update
  update(update: Partial<State>): void {
    const section =
      update.section ?? this.getStateFromUrl(this.router.url).section;
    let paths = [`/${section}`];
    if (update.contentPath) {
      const contentPath = update.contentPath.split('/');
      paths = [...paths, ...contentPath];
    }
    this.router.navigate(paths);
  }
}
