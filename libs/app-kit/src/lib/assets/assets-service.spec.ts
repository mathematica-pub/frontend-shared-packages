/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MainServiceStub } from '../core/testing/stubs/services/main.service.stub';
import { AdkAssetsResource } from './assets-resource';
import { AdkAssetResponse, AdkAssetsService } from './assets-service';

describe('AssetsService', () => {
  let service: AdkAssetsService;
  let mainServiceStub: MainServiceStub;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
    TestBed.configureTestingModule({
      providers: [
        AdkAssetsService,
        {
          provide: AdkAssetsResource,
          useValue: mainServiceStub.assetsResourceStub,
        },
      ],
    });
    service = TestBed.inject(AdkAssetsService);
  });

  describe('setAssetsPath()', () => {
    it('should set the assets path', () => {
      service.setAssetsPath('test/');
      expect(service['assetsPath']).toBe('test/');
    });
  });

  describe('getAsset()', () => {
    beforeEach(() => {
      spyOn(service as any, 'fetchAsset').and.returnValue(of('asset text'));
    });
    it('calls fetch asset if asset does not exist in assets object', (done) => {
      service.getAsset('test', AdkAssetResponse.Text).subscribe(() => {
        expect(service['fetchAsset']).toHaveBeenCalledOnceWith(
          'test',
          AdkAssetResponse.Text
        );
        done();
      });
    });
    it('does not call fetch asset if asset exists in assets object', (done) => {
      service['assets']['test'] = of('asset text');
      service.getAsset('test', AdkAssetResponse.Text).subscribe(() => {
        expect(service['fetchAsset']).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
