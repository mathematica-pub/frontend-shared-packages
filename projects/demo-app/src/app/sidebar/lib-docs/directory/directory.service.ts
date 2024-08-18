import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DirectoryService {
  level: number = 0;
  activeItemPath: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeItemPath$ = this.activeItemPath.asObservable();

  setActiveItemPath(path: string): void {
    this.activeItemPath.next(path);
  }
}
