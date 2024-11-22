/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ListboxFilteringService } from './listbox-filtering.service';

describe('ListboxFilteringService', () => {
  let service: ListboxFilteringService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListboxFilteringService],
    });
    service = TestBed.inject(ListboxFilteringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
