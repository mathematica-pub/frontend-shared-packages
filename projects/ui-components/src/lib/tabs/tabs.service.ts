import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TabItemComponent } from './tab-item.component';

@Injectable({
  providedIn: 'root',
})
export class TabsService<T> {
  activeTab: BehaviorSubject<TabItemComponent<T> | null> =
    new BehaviorSubject<TabItemComponent<T> | null>(null);
  activeTab$ = this.activeTab.asObservable();
}
