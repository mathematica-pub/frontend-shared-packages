export class OverlayStub {
  create = jasmine.createSpy('create');
  scrollStrategies = {
    reposition: jasmine.createSpy('noop').and.returnValue('noop' as any),
  };
}
