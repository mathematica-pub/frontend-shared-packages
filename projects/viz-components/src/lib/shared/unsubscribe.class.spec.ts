import { UnsubscribeStub } from '../testing/stubs/unsubscribe.class.stub';

describe('the Subscription abstract class', () => {
  let abstractClass: UnsubscribeStub;

  beforeEach(() => {
    abstractClass = new UnsubscribeStub();
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(abstractClass.unsubscribe, 'next');
      spyOn(abstractClass.unsubscribe, 'complete');
    });

    it('calls abstractClass.unsubscribe.next', () => {
      abstractClass.ngOnDestroy();
      expect(abstractClass.unsubscribe.next).toHaveBeenCalledTimes(1);
    });

    it('calls abstractClass.unsubscribe.complete', () => {
      abstractClass.ngOnDestroy();
      expect(abstractClass.unsubscribe.complete).toHaveBeenCalledTimes(1);
    });
  });
});
