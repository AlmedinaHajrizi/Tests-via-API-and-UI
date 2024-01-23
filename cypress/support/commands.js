// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import loginInfoPO from "../e2e/loginInfoPO";

Cypress.Commands.add('loginByApi', (username, password) => {
    cy.request(
        "POST",
        `${Cypress.env("apiUrl")}/login`,
        { "type": "LOGIN", "username": `${username}`, "password": `${password}`, "remember": true });
});

Cypress.Commands.add('createBankAccount', (userID, bankName, accountNumber, routingNumber) => {
    cy.request(
        "POST",
        `${Cypress.env("apiUrl")}/graphql`,
        { "operationName": "CreateBankAccount", "query": "\n  mutation CreateBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {\n    createBankAccount(\n      bankName: $bankName\n      accountNumber: $accountNumber\n      routingNumber: $routingNumber\n    ) {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n    }\n  }\n", "variables": { "userId": `${userID}`, "bankName": `${bankName}`, "accountNumber": `${accountNumber}`, "routingNumber": `${routingNumber}` } }
    );
});

Cypress.Commands.add('deleteBankAccount', (id) => {
    cy.request(
        "POST",
        `${Cypress.env("apiUrl")}/graphql`,
        { "operationName": "DeleteBankAccount", "query": "\n  mutation DeleteBankAccount($id: ID!) {\n    deleteBankAccount(id: $id)\n  }\n", "variables": { "id": `${id}` } }
    );
    cy.log(`Bank with ID: ${id} has been deleted`);
});

Cypress.Commands.add('getTransactionsPublic', () => {
    cy.request({
        method: 'GET',
        url: `${Cypress.env("apiUrl")}/transactions/public`,
    });
});

Cypress.Commands.add('updateUserInfo', (userId, updatedInfo) => {
    cy.request({
        method: 'PATCH',
        url: `${Cypress.env("apiUrl")}/users/${userId}`,
        body: updatedInfo,
    });
});


//command : login through UI and API:
Cypress.Commands.add('loginWithRememberMe', () => {
    // choose device for testing
    cy.viewport('macbook-15');

    // create intercept for login request
    cy.intercept('POST', '/login').as('postLogin');

    cy.visit('/');

    // Fill data to login through UI
    cy.get(loginInfoPO.inputUsername).clear().type(loginInfoPO.username);
    cy.get(loginInfoPO.inputPassword).clear().type(loginInfoPO.password);

    // Check remember me 
    cy.get(loginInfoPO.checkboxRememberMe).check();

    // Click the login button
    cy.get(loginInfoPO.buttonLogin).click();

    // Verify with API
    // cy.wait and verify login
    cy.wait('@postLogin').then((data) => {
        // Verify response with expect
        expect(data.response.statusCode).to.eq(loginInfoPO.status200);
        expect(data.response.body.user.firstName).to.eq(loginInfoPO.firstname);
        expect(data.response.body.user.lastName).to.eq(loginInfoPO.lastname);
        expect(data.response.body.user.username).to.eq(loginInfoPO.username);
    });
    // do a screenshot after login
    cy.screenshot('login/should-login');
});
