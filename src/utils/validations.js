
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

module.exports = {
    validateSignUpData,
}