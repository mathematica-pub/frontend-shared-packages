import { LinesHoverAndMoveEvent } from './lines-hover-move-event.directive';
import { LinesInputEvent } from './lines-input-event.directive';

export interface LinesHoverAndMoveEffect {
  applyEffect: (event: LinesHoverAndMoveEvent) => void;
  removeEffect: (event: LinesHoverAndMoveEvent) => void;
}

export interface LinesInputEffect {
  applyEffect: (event: LinesInputEvent, ...args) => void;
  removeEffect: (event: LinesInputEvent, ...args) => void;
}
