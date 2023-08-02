export class OverlayStub {
  create = jasmine.createSpy('create');
  scrollStrategies = {
    noop: jasmine.createSpy('noop').and.returnValue('noop' as any),
  };
}
