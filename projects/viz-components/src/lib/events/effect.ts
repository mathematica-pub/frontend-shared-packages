export interface EventEffect<T> {
  applyEffect: (directive: T) => void;
  removeEffect: (directive: T) => void;
}

export interface HoverMoveEventEffect<T> extends EventEffect<T> {
  initializeEffect?: (directive: T) => void;
}

export interface InputEventEffect<T> {
  applyEffect: (directive: T, ...args) => void;
  removeEffect: (directive: T, ...args) => void;
}
