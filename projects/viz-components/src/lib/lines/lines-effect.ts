import { LinesHoverEventDirective } from './lines-hover-event.directive';
import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

export interface LinesHoverAndMoveEffect {
  applyEffect: (event: LinesHoverAndMoveEventDirective) => void;
  removeEffect: (event: LinesHoverAndMoveEventDirective) => void;
}

export interface LinesHoverEffect {
  applyEffect: (event: LinesHoverEventDirective) => void;
  removeEffect: (event: LinesHoverEventDirective) => void;
}

export interface LinesInputEffect {
  applyEffect: (event: LinesInputEventDirective, ...args) => void;
  removeEffect: (event: LinesInputEventDirective, ...args) => void;
}
