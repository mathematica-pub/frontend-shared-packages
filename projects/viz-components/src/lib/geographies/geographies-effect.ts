import { GeographiesHoverAndMoveEventDirective } from './geographies-hover-move-event.directive';

export interface GeographiesHoverAndMoveEffect {
  applyEffect: (event: GeographiesHoverAndMoveEventDirective) => void;
  removeEffect: (event: GeographiesHoverAndMoveEventDirective) => void;
}

//   export interface GeographiesHoverEffect {
//     applyEffect: (event: GeographiesHoverEventDirective) => void;
//     removeEffect: (event: GeographiesHoverEventDirective) => void;
//   }

//   export interface GeographiesInputEffect {
//     applyEffect: (event: GeographiesInputEventDirective, ...args) => void;
//     removeEffect: (event: GeographiesInputEventDirective, ...args) => void;
//   }
