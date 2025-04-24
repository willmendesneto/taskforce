describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show validation errors for invalid email and missing password', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email address.').should('exist');
    cy.contains('Password is required.').should('exist');
  });

  it('should show a `403 - Access Denied` page if malicious user tries to hack login', () => {
    cy.intercept('POST', `/api/auth/callback/credentials`, {
      statusCode: 200,
      body: { url: 'http://localhost:3000/login' },
    }).as('loginRequest');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/403');
  });

  it('should show an error message for invalid credentials', () => {
    cy.intercept('POST', `/api/auth/callback/credentials`, {
      statusCode: 401,
      body: {
        url: 'http://localhost:3000/api/auth/error?error=CredentialsSignin&provider=credentials',
      },
    }).as('loginRequestInvalidCredentials');
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequestInvalidCredentials');
    cy.contains('Invalid email or password').should('exist');
  });

  // Please make sure you're running Docker Compose to make sure this user is available ONLY for testing purposes
  // More details about the setup for this user by default on `init-db.sql`
  it('should show dashboard page if user is valid', () => {
    cy.get('input[name="email"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
});
