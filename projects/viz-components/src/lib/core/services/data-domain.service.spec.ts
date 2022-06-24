import { TestBed } from '@angular/core/testing';

import { DataDomainService } from './data-domain.service';

describe('DataDomainService', () => {
  let service: DataDomainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDomainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
