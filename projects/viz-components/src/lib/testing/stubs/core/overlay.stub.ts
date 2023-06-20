export class OverlayStub {
  create = jasmine.createSpy('create');
  scrollStrategies = {
    reposition: jasmine
      .createSpy('reposition')
      .and.returnValue('reposition' as any),
  };
}
