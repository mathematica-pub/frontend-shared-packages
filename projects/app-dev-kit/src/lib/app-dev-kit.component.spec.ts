import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDevKitComponent } from './app-dev-kit.component';

describe('AppDevKitComponent', () => {
  let component: AppDevKitComponent;
  let fixture: ComponentFixture<AppDevKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDevKitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDevKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
