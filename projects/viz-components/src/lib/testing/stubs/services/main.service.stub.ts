import { OverlayStub } from '../core/overlay.stub';
import { UnsubscribeStub } from '../unsubscribe.class.stub';
import { UtilitiesServiceStub } from './utilities.service.stub';

export class MainServiceStub {
  unsubscribeStub = new UnsubscribeStub();
  utilitiesServiceStub = new UtilitiesServiceStub();
  overlayStub = new OverlayStub();
}
