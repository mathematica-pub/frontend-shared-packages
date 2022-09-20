import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPlaygroundComponent } from './download-playground.component';

describe('DownloadPlaygroundComponent', () => {
  let component: DownloadPlaygroundComponent;
  let fixture: ComponentFixture<DownloadPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPlaygroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
