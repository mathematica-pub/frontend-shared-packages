export interface EventAction<Directive> {
  onStart: (directive: Directive) => void;
  onEnd: (directive: Directive) => void;
}

export interface HoverMoveAction<Directive> extends EventAction<Directive> {
  initialize?: (directive: Directive) => void;
}

export interface InputEventAction<Directive> {
  onStart: (directive: Directive, ...args) => void;
  onEnd: (directive: Directive, ...args) => void;
}
