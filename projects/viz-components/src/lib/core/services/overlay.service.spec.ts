import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { OverlayService } from './overlay.service';

describe('OverlayServiceService', () => {
  let service: OverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Overlay],
    });
    service = TestBed.inject(OverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
