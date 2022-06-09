import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlTooltipComponent } from './html-tooltip.component';

describe('HtmlTooltipComponent', () => {
  let component: HtmlTooltipComponent;
  let fixture: ComponentFixture<HtmlTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtmlTooltipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlTooltipComponent);
    component = fixture.componentInstance;
  });

  describe('getLeftOffset()', () => {
    it('returns the correct value', () => {
      component.left = 100;
      expect(component.getLeftOffset(50)).toEqual(75);
    });
  });
});
