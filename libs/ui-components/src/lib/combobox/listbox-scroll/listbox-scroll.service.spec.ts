import { TestBed } from '@angular/core/testing';

import { ListboxScrollService } from './listbox-scroll.service';

describe('ListboxScrollService', () => {
  let service: ListboxScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListboxScrollService],
    });
    service = TestBed.inject(ListboxScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
