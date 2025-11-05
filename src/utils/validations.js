
const { Error } = require('mongoose');
const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, password, emailId, age } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (firstName < 4 || firstName > 50) {
        throw new Error("Name must be between 4-50 characters!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("enter a strong password.");
    }
}

const validateEditData = (req) => {
    const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender",
        "photoUrl", "about",
        "skills"
    ];

    const isValidEdit = Object.keys(req.body).every(field => {
        return ALLOWED_UPDATES.includes(field);
    });
    return isValidEdit;
};

const validateNewPassword = (req) => {
    const ALLOWED_FIELDS_PASS = ["newPassword", "confirmPassword"];

    const isAllowedPasswordEdit = Object.keys(req.body).every(field => {
        return ALLOWED_FIELDS_PASS.includes(field);
    });

    const isConfirmedPassword = req.body["newPassword"] === req.body["confirmPassword"];

    return isAllowedPasswordEdit && validator.isStrongPassword(req.body["newPassword"]) && isConfirmedPassword;
};

module.exports = {
    validateSignUpData,
    validateEditData,
    validateNewPassword
}