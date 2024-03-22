export interface EventEffect<Directive> {
  applyEffect: (directive: Directive) => void;
  removeEffect: (directive: Directive) => void;
}

export interface HoverMoveEventEffect<Directive>
  extends EventEffect<Directive> {
  initializeEffect?: (directive: Directive) => void;
}

export interface InputEventEffect<Directive> {
  applyEffect: (directive: Directive, ...args) => void;
  removeEffect: (directive: Directive, ...args) => void;
}
