import { TestBed } from '@angular/core/testing';

import { VicExportDataService } from './export-data.service';

describe('ExportDataService', () => {
  let service: VicExportDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VicExportDataService],
    });
    service = TestBed.inject(VicExportDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertToTitle function', () => {
    it('should convert camel case to title', () => {
      expect(service.convertToTitle('thisString')).toBe('This String');
      expect(service.convertToTitle('123String')).toBe('123 String');
      expect(service.convertToTitle('123string')).toBe('123 string');
      expect(service.convertToTitle('string123')).toBe('String 123');
      expect(service.convertToTitle('thisSTRING')).toBe('This STRING');
      expect(service.convertToTitle('thisSTRiNG')).toBe('This STRi NG');
    });
  });
});
