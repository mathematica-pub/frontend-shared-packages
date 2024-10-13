import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  store(): void {}
  shouldAttach(): boolean {
    return false;
  }
  retrieve(): DetachedRouteHandle {
    return null;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.fragment !== null) return true;
    return false;
  }
}
