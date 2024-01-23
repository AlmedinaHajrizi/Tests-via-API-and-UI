const userToPay = 'Kaylin Homenick';
const amount = 10;
const description = 'Paying bill...';
const screenshotPayment = 'payment/payment-finished';
const status200 = 200;

const newTransactionLink = 'a[data-test="nav-top-new-transaction"]';
const inputSearchUser = 'input[data-test="user-list-search-input"]';
const inputAmount = 'input#amount';
const inputDescription = 'input#transaction-create-description-input';
const buttonPay = 'button[data-test="transaction-create-submit-payment"]';
const linkTransactions = 'a[data-test="new-transaction-return-to-transactions"]';

export default {
    userToPay,
    amount,
    description,
    screenshotPayment,
    status200,
    newTransactionLink,
    inputSearchUser,
    inputAmount,
    inputDescription,
    buttonPay,
    linkTransactions
};