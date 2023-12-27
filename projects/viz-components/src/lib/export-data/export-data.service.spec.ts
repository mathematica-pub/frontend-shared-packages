import { TestBed } from '@angular/core/testing';

import { VicExportDataService } from './export-data.service';
import { VicDataExportConfig } from './data-export.config';

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
      const dataExportConfig = new VicDataExportConfig();
      expect(dataExportConfig.convertToTitle('thisString')).toBe('This String');
      expect(dataExportConfig.convertToTitle('123String')).toBe('123 String');
      expect(dataExportConfig.convertToTitle('123string')).toBe('123 string');
      expect(dataExportConfig.convertToTitle('string123')).toBe('String 123');
      expect(dataExportConfig.convertToTitle('thisSTRING')).toBe('This STRING');
      expect(dataExportConfig.convertToTitle('thisSTRiNG')).toBe(
        'This STRi NG'
      );
    });
  });
});
