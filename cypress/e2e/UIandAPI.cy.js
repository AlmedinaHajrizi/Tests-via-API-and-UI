import notificationsInfoPO from "./notificationsInfoPO.JS";
import paymentInfoPO from "./paymentInfoPO";
describe('Tests through UI and API', () => {
    beforeEach(() => {
        //clear cookies for current domain
        cy.clearCookies();
        //login before each test
        cy.loginWithRememberMe();
    })

    it('Dismiss the first notification', () => {
        // Create intercept for dismiss request
        cy.intercept('PATCH', '/notifications/*').as('dismissRequest');

        // Visit the page
        cy.get('span').contains('Notifications').click();
        cy.location('pathname').should('eq', '/notifications');

        // Dismiss the first notification
        cy.get(notificationsInfoPO.notificationList).first().invoke('attr', 'data-test').then((dataTestAttribute) => {
            //Get notification id
            const notificationId = notificationsInfoPO.getNotificationId(dataTestAttribute);

            // Dismiss the first notification
            cy.get(notificationsInfoPO.getDismissButtonSelector(notificationId)).click();

            // Verify with API
            cy.wait('@dismissRequest').then((data) => {
                // Verify response with expect
                expect(data.response.statusCode).to.eq(notificationsInfoPO.status204);
            });
        });
    });


    it('Do payment', () => {
        // Intercept the POST request for transactions
        cy.intercept('POST', '/transactions').as('doPayment');

        // Click on the new transaction link
        cy.get(paymentInfoPO.newTransactionLink).click();

        // Wait for the user list search input to be visible
        cy.get(paymentInfoPO.inputSearchUser).should('be.visible');

        // Type the name and select the user
        cy.get(paymentInfoPO.inputSearchUser).type(paymentInfoPO.userToPay);
        cy.get('span').contains(paymentInfoPO.userToPay).click();

        // Enter amount and description
        cy.get(paymentInfoPO.inputAmount).type(paymentInfoPO.amount);
        cy.get(paymentInfoPO.inputDescription).type(paymentInfoPO.description);

        // Click on the payment button
        cy.get(paymentInfoPO.buttonPay).click();

        // Wait for the intercepted request to complete
        cy.wait('@doPayment').then((interception) => {
            // Log the response for debugging
            cy.log(interception.response);

            // Verify response with expect
            expect(interception.response.statusCode).to.eq(paymentInfoPO.status200);
            // Add additional verification if needed
        });

        // do a screenshot after payment is finished
        cy.screenshot(paymentInfoPO.screenshotPayment);

        // Click on the link to return to transactions
        cy.get(paymentInfoPO.linkTransactions).click();
    });

})