import loginInfoPO from "./loginInfoPO";
import bankInfoPO from "./bankInfoPO";
import userInfoPO from "./userInfoPO";
describe('Tests through API', () => {
  let bankID;
  // LOGIN
  beforeEach(() => {
    cy.clearCookies();
    cy.loginByApi(loginInfoPO.username, loginInfoPO.password).then((response) => {
      expect(response.status).to.eq(loginInfoPO.status200);
      expect(response.body.user.username).to.eq(loginInfoPO.username);
    });
  })
  
  //CREATE AND DELETE
  it('Create bank account and delete it', () => {
    cy.createBankAccount(bankInfoPO.userID, bankInfoPO.bankName, bankInfoPO.accountNumber, bankInfoPO.routingNumber).then((response) => {
      expect(response.body.data.createBankAccount.userId).to.eq(bankInfoPO.userID);
      expect(response.body.data.createBankAccount.bankName).to.eq(bankInfoPO.bankName);
      expect(response.body.data.createBankAccount.accountNumber).to.eq(bankInfoPO.accountNumber);
      expect(response.body.data.createBankAccount.routingNumber).to.eq(bankInfoPO.routingNumber);

      bankID = response.body.data.createBankAccount.id //bank id
      cy.log('Bank Id', bankID);
      cy.deleteBankAccount(bankID);
    });
  });

  // GET
  it('Get list of public transactions', () => {
    // Use the custom command to make a GET request
    cy.getTransactionsPublic().then((response) => {
      // For example, you can check the status code
      expect(response.status).to.eq(loginInfoPO.status200);
      // log the response
      cy.log(response.body.results);
    });
  });

  //UPDATE
  it('Update user data', () => {
    // Use the custom command to make a PATCH request
    cy.updateUserInfo(userInfoPO.userId, userInfoPO.updatedInfo).then((response) => {
      expect(response.status).to.eq(userInfoPO.status204);
    });
  });


});