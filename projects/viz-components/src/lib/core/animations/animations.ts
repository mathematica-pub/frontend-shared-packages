import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const defaultAnimationDuration = '250ms';

export const animations = {
  slide: (className: string) =>
    trigger('slide', [
      transition(':enter', [
        query(`.${className}`, [
          style({ opacity: 0, height: 0 }),
          animate(
            `${defaultAnimationDuration} ease-out`,
            style({
              opacity: 1,
              height: '*',
            })
          ),
        ]),
      ]),
      transition(':leave', [
        query(`.${className}`, [
          style({ opacity: 1, height: '*' }),
          animate(
            `${defaultAnimationDuration} ease-in`,
            style({
              opacity: 0,
              height: 0,
            })
          ),
        ]),
      ]),
    ]),
};
