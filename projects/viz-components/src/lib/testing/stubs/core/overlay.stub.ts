export class OverlayStub {
  create = jasmine.createSpy('create');
  scrollStrategies = {
    noop: jasmine.createSpy('noop').and.returnValue('noop' as any),
    close: jasmine.createSpy('close').and.returnValue('close' as any),
  };
}
