import { LinesHoverAndMoveEventDirective } from './lines-hover-move-event.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

type LinesEvent = LinesHoverAndMoveEventDirective; // add other events as they are developed -- for example, click, etc.

export interface LinesSvgEventEffect {
  applyEffect: (event: LinesEvent) => void;
  removeEffect: (event: LinesEvent) => void;
}

export interface LinesInputEffect {
  applyEffect: (event: LinesInputEventDirective, ...args) => void;
  removeEffect: (event: LinesInputEventDirective, ...args) => void;
}
