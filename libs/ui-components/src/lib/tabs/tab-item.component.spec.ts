/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabItemComponent } from './tab-item.component';
import { TabsService } from './tabs.service';

describe('TabItemComponent', () => {
  let component: TabItemComponent<any>;
  let fixture: ComponentFixture<TabItemComponent<any>>;
  let service: TabsService<any>;

  beforeEach(async () => {
    service = new TabsService();
    await TestBed.configureTestingModule({
      imports: [TabItemComponent],
      providers: [
        {
          provide: TabsService,
          useValue: service,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabItemComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(service.activeTab, 'next');
    });
    it('should call activeTab next on service if isActive is true', () => {
      component.isActive = true;
      component.ngOnChanges();
      expect(service.activeTab.next).toHaveBeenCalledOnceWith(component);
    });
    it('should not call selectTab if isActive is false', () => {
      component.isActive = false;
      component.ngOnChanges();
      expect(service.activeTab.next).not.toHaveBeenCalled();
    });
  });
});
