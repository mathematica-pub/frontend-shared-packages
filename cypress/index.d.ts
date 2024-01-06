/// <reference types="cypress" />

import { mount } from 'cypress/angular';
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
