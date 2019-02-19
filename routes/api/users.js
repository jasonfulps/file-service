const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const passport = require('passport');
const logger = require('../../lib/logger');
const i = require('../../i18n/localize');
const privateKey = config.authentication.secretOrPrivateKey;
const expiresIn = config.authentication.expiresIn;
const session = config.authentication.session;
const validateRegistration = require('../../validation/register');

/**
 * @route   GET /api/users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {

    // Validate request
    const {errors, isValid} = validateRegistration(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                errors.email = i("EMAIL_ALREADY_EXISTS");
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json({email:user.email, status: i('USER_REGISTERED')}))
                            .catch(err => logger.error(err));
                    })
                })
            }
        })
});

/**
 * @route   GET /api/users/login
 * @desc    Login User / Return JWT Token
 * @access  Public
 */
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {

            // Check user
            if (!user) {
                return res.status(404).json({email: "USER_NOT_FOUND"})
            }

            // Verify password
            bcrypt.compare(password, user.password)
                .then(matches => {
                    if (matches) {
                        // Password success
                        const payload = {id: user.id, name: user.name};
                        jwt.sign(payload, privateKey, {expiresIn: expiresIn}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer '+token
                            });
                        });
                    } else {
                        return res.status(400).json({password: i("USER_PASSWORD_INCORRECT")})
                    }
                })
        })
});

/**
 * @route   GET /api/users/current
 * @desc    Return current user
 * @access  Private
 */
router.get('/current', passport.authenticate('jwt', {session: session}), (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    });
});

module.exports = router;