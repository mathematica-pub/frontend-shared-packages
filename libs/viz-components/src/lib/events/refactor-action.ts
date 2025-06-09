import { EventAction } from './action';
import { ActionHost } from './refactor-event.directive';

export interface RefactorEventAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> {
  onStart: (host: Host) => void;
  onEnd: (host: Host) => void;
}

export interface RefactorHoverMoveAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> extends EventAction<Host> {
  initialize?: (host: Host) => void;
}

export interface RefactorInputEventAction<
  Host extends ActionHost<Output>,
  Output = unknown,
> {
  onStart: (host: Host, ...args) => void;
  onEnd: (host: Host, ...args) => void;
}
