// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Add Testing Library commands
// import '@testing-library/cypress/add-commands';

// Prevent test failure on uncaught exceptions from API errors
// This is useful for ignoring network errors that might affect the test assertion, such as API errors, network issues, etc.
Cypress.on('uncaught:exception', err => {
  // Check if the error is API-related. At the moment, the error should cover only HTTP status code 500
  if (
    err.message.includes('Internal Server Error') ||
    err.message.includes('Invalid credentials') ||
    err.message.includes('500') ||
    err.message.includes('401') ||
    err.message.includes('api') ||
    err.message.includes('network')
  ) {
    // Returning false prevents Cypress from failing the test
    return false;
  }

  // Return true for other uncaught exceptions (test will keep the flow and fail)
  return true;
});
