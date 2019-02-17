const Validator = require('validator');
const isEmpty = require('../lib/isEmpty');

module.exports = function validateRegisterInput(data) {

    let errors = {};
    data.name = data.name || '';
    data.email = data.email || '';
    data.password = data.password || '';
    data.password2 = data.password2 || '';

    // Name
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    // Email
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else
    if(Validator.isEmail(data.email)) {
        errors.email = 'Invalid email';
    }

    // Password
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Password confirmation is required';
    }

    if(Validator.equals(data.password2, data.password)) {
        errors.password2 = 'Password must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};