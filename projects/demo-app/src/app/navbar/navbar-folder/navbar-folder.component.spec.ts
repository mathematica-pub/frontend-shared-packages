import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFolderComponent } from './navbar-folder.component';

describe('SingleNavbarLinkComponent', () => {
  let component: NavbarFolderComponent;
  let fixture: ComponentFixture<NavbarFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarFolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
