import { UnsubscribeStub } from '../unsubscribe.class.stub';
import { OverlayServiceStub } from './overlay.service.stub';
import { UtilitiesServiceStub } from './utilities.service.stub';

export class MainServiceStub {
  overlayServiceStub = new OverlayServiceStub();
  unsubscribeStub = new UnsubscribeStub();
  utilitiesServiceStub = new UtilitiesServiceStub();
}
