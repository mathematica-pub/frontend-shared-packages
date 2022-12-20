import { TestBed } from '@angular/core/testing';

import { VicExportDataService } from './export-data.service';

describe('ExportDataService', () => {
  let service: VicExportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VicExportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
