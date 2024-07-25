/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabItemComponent } from './tab-item.component';
import { TabsComponent } from './tabs.component';
import { TabsService } from './tabs.service';

describe('TabsComponent', () => {
  let component: TabsComponent<any>;
  let fixture: ComponentFixture<TabsComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [TabsService],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
  });

  describe('selectTab', () => {
    let newTab: TabItemComponent<string>;
    beforeEach(() => {
      newTab = new TabItemComponent(component.service);
      spyOn(component, 'emitNewActiveTab');
    });
    it('sets the activeTab to new tab if new tag is not activeTab', () => {
      component.selectTab(newTab);
      expect(component.service.activeTab.value).toEqual(newTab);
    });
    it('calls emitNewActiveTab if new tab is not activeTab', () => {
      component.selectTab(newTab);
      expect(component.emitNewActiveTab).toHaveBeenCalledWith(newTab);
    });
    it('does not call next on activeTab if new tab is activeTab', () => {
      component.service.activeTab.next(newTab);
      spyOn(component.service.activeTab, 'next');
      component.selectTab(newTab);
      expect(component.service.activeTab.next).not.toHaveBeenCalled();
    });
    it('does not call emitNewActiveTab if new tab is activeTab', () => {
      component.service.activeTab.next(newTab);
      component.selectTab(newTab);
      expect(component.emitNewActiveTab).not.toHaveBeenCalled();
    });
  });

  describe('emitNewActiveTab', () => {
    let newTab: TabItemComponent<string>;
    beforeEach(() => {
      newTab = new TabItemComponent(component.service);
      newTab.labelComponent = {
        labelElement: {
          nativeElement: {
            innerText: 'label',
          },
        },
      } as any;
      spyOn(component.tabChange, 'emit');
    });
    it('calls emit on tabChange with labelComponent value if it exists', () => {
      newTab.value = 'value';
      component.emitNewActiveTab(newTab);
      expect(component.tabChange.emit).toHaveBeenCalledWith('value');
    });
    it('calls emit on tabChange with labelComponent labelElement innerText if value does not exist', () => {
      component.emitNewActiveTab(newTab);
      expect(component.tabChange.emit).toHaveBeenCalledWith('label');
    });
  });
});
