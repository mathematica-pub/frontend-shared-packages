import { EventEmitter } from '@angular/core';
import { LinesComponent } from './lines.component';
import { LinesEmittedData } from './lines.model';

export interface LinesEffect {
  applyEffect: (lines: LinesComponent, ...args) => void;
  removeEffect: (lines: LinesComponent, ...args) => void;
}

export interface LinesHoverAndMoveEffect {
  applyEffect: (
    lines: LinesComponent,
    closestPointIndex: number,
    dataEmitter: EventEmitter<LinesEmittedData>
  ) => void;
  removeEffect: (
    lines: LinesComponent,
    dataEmitter: EventEmitter<LinesEmittedData>
  ) => void;
}

export interface LinesInputEffect {
  applyEffect: (
    lines: LinesComponent,
    input: any,
    dataEmitter: EventEmitter<any>
  ) => void;
  removeEffect: (
    lines: LinesComponent,
    input: any,
    dataEmitter: EventEmitter<any>
  ) => void;
}
