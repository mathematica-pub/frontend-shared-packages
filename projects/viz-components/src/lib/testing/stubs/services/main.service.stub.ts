import { UnsubscribeStub } from '../unsubscribe.class.stub';
import { UtilitiesServiceStub } from './utilities.service.stub';

export class MainServiceStub {
  utilitiesServiceStub = new UtilitiesServiceStub();
  unsubscribeStub = new UnsubscribeStub();
}
