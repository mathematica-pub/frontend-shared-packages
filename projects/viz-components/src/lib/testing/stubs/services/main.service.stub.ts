import { OverlayStub } from '../core/overlay.stub';
import { UnsubscribeStub } from '../unsubscribe.class.stub';

export class MainServiceStub {
  unsubscribeStub = new UnsubscribeStub();
  overlayStub = new OverlayStub();
}
