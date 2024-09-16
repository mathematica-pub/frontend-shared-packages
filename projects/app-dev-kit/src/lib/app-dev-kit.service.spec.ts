import { TestBed } from '@angular/core/testing';

import { AppDevKitService } from './app-dev-kit.service';

describe('AppDevKitService', () => {
  let service: AppDevKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDevKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
