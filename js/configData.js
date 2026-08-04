"use strict";

const configData = {
    env: {
        baseUrl: "https://api.testservice.com",
        minPasswordLength: 8,
        defaultRole: "tester"
    },
    mockResponse: {
        status: "success",
        code: 200,
        token: "  bearer_secret_token_12345  ",
        userEmail: "qa.user@test.com"
    }
};

module.exports = configData;