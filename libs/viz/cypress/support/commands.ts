/// <reference types="cypress" />
import 'cypress-real-events';
import type { RealClickOptions } from 'cypress-real-events/commands/realClick';
import type { RealHoverOptions } from 'cypress-real-events/commands/realHover';
import type { RealPressOptions } from 'cypress-real-events/commands/realPress';
import type { keyCodeDefinitions } from 'cypress-real-events/keyCodeDefinitions';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare const Cypress: Cypress.Cypress;
declare const cy: Cypress.cy;

type Key = keyof typeof keyCodeDefinitions;
type KeyOrShortcut = Key | Array<Key>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      /**
       * Performs a real click and waits for Angular change detection.
       * Use this instead of realClick() in Angular tests.
       * @example cy.get('.button').realClickAndWait()
       */
      realClickAndWait(options?: RealClickOptions): Chainable<Subject>;

      /**
       * Performs a real hover and waits for Angular change detection.
       * Use this instead of realHover() in Angular tests.
       * @example cy.get('.element').realHoverAndWait()
       */
      realHoverAndWait(options?: RealHoverOptions): Chainable<Subject>;

      /**
       * Performs a real key press and waits for Angular change detection.
       * Use this instead of realPress() in Angular tests.
       * @example cy.realPressAndWait('Tab')
       */
      realPressAndWait(
        keyOrShortcut: KeyOrShortcut,
        options?: RealPressOptions
      ): Chainable<Subject>;
    }
  }
}

/**
 * Custom command that wraps realClick with automatic Angular change detection wait.
 * This ensures observables have time to emit and async pipes update the DOM
 * after interactions with Angular 21's new control flow.
 */
Cypress.Commands.add(
  'realClickAndWait',
  { prevSubject: 'element' },
  function (subject, options) {
    cy.wrap(subject).realClick(options);
    return cy.wait(500).then(() => subject);
  }
);

/**
 * Custom command that wraps realHover with automatic Angular change detection wait.
 * This ensures observables have time to emit and async pipes update the DOM
 * after hover interactions with Angular 21's new control flow.
 */
Cypress.Commands.add(
  'realHoverAndWait',
  { prevSubject: 'element' },
  function (subject, options) {
    cy.wrap(subject).realHover(options);
    return cy.wait(500).then(() => subject);
  }
);

/**
 * Custom command that wraps realPress with automatic Angular change detection wait.
 * This ensures observables have time to emit and async pipes update the DOM
 * after keyboard interactions with Angular 21's new control flow.
 */
Cypress.Commands.add('realPressAndWait', function (keyOrShortcut, options) {
  cy.realPress(keyOrShortcut, options);
  return cy.wait(500);
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
