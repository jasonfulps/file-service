const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const passport = require('passport');
const privateKey = config.authentication.secretOrPrivateKey;
const expiresIn = config.authentication.expiresIn;
const session = config.authentication.session;

/**
 * @route   GET /api/users/test
 * @desc    Test users route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'Users route works'}));

/**
 * @route   GET /api/users/register
 * @desc    Register user
 * @access  Public
 */
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'});
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
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
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
                return res.status(404).json({email: 'Route - User not found'})
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
                        return res.status(400).json({password: 'Password incorrect'})
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
    res.json(req.user);
});

module.exports = router;