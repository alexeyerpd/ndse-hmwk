const ERROR_MESSAGES_DICT = {
    400: { success: false, errorMessage: 'Bad request' },
    404: { success: false, errorMessage: 'Not found' },
    500: { success: false, errorMessage: 'Internal server error' },
};

module.exports = {
    ERROR_MESSAGES_DICT,
};
