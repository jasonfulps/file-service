const Validator = require('validator');
const isEmpty = require('../lib/isEmpty');
const i = require('../i18n/localize');

module.exports = function validateRegisterInput(data) {

    let errors = {};
    data.name = data.name || '';
    data.email = data.email || '';
    data.password = data.password || '';
    data.password2 = data.password2 || '';

    // Name
    if(Validator.isEmpty(data.name)) {
        errors.name = i('NAME_REQUIRED');
    }

    // Email
    if(Validator.isEmpty(data.email)) {
        errors.email = i('EMAIL_REQUIRED');
    } else
    if(!Validator.isEmail(data.email)) {
        errors.email = i('EMAIL_INVALID');
    }

    // Password
    if(Validator.isEmpty(data.password)) {
        errors.password = i('PASSWORD_REQUIRED');
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = i('PASSWORD_CONFIRMATION_REQUIRED');
    }

    if(!Validator.equals(data.password2, data.password)) {
        errors.password2 = i('PASSWORDS_MUST_MATCH');
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};