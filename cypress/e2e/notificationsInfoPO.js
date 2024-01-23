const notificationList = '[data-test^="notification-list-item-"]';
const status204 = 204;
const getNotificationId = (dataTestAttribute) => {
    return dataTestAttribute.replace('notification-list-item-', '');
};

const getDismissButtonSelector = (notificationId) => {
    return `[data-test="notification-mark-read-${notificationId}"]`;
};
export default {
    notificationList,
    status204,
    getNotificationId,
    getDismissButtonSelector
};