/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TabsService } from './tabs.service';

describe('TabsService', () => {
  let service: TabsService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
