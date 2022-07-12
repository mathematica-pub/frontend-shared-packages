import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCardsDisplayComponent } from './component-cards-display.component';

describe('ComponentCardsDisplayComponent', () => {
  let component: ComponentCardsDisplayComponent;
  let fixture: ComponentFixture<ComponentCardsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentCardsDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentCardsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
