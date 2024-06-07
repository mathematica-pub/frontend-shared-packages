/* eslint-disable @typescript-eslint/no-explicit-any */
import { of } from 'rxjs';

export class OverlayRefStub {
  attach = jasmine.createSpy('attach');
  detach = jasmine.createSpy('detach');
  dispose = jasmine.createSpy('dispose');
  addPanelClass = jasmine.createSpy('addPanelClass');
  removePanelClass = jasmine.createSpy('removePanelClass');
  updateSize = jasmine.createSpy('updateSize');
  updatePositionStrategy = jasmine.createSpy('updatePositionStrategy');
  backdropClick = of('click' as any);
}
