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
    this.state$.subscribe((state) => console.log(state));
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
    console.log(url);
    const fragments = url.split('/');
    return {
      lib: fragments[1] as Library,
      section: fragments[2] as Section,
      contentPath: fragments.slice(3).join('/'),
    };
  }

  update(update: Partial<State>): void {
    console.log('update', update);
    const state = this.getStateFromUrl(this.router.url);
    const updatedState = { ...state, ...update };
    let paths = [`/${updatedState.lib}`, updatedState.section];
    if (updatedState.contentPath) {
      const contentPath = updatedState.contentPath.split('/');
      paths = [...paths, ...contentPath];
    }
    console.log('paths', paths);
    this.router.navigate(paths);
  }
}
