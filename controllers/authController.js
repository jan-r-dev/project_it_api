const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const util = require('util');


const signToken = async id => {
    try {
        const readFile = util.promisify(fs.readFile);
        const key = await readFile(`${__dirname}/key.pem`, { encoding: 'utf-8' });
    
        return jwt.sign(
            { id: id },
            key,
            {
                algorithm: 'PS512',
                expiresIn: '90d'
            }
        );
    } catch (err) {
        console.log(err.message);
    };
};

const createSendToken = async (user, statusCode, res) => {
    const token = await signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1),
        secure: false,
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.loginUser = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) return next(new Error('Requires email and password'));

        const user = await User.findOne({ email: req.body.email }).select('+password');

        const result = await user.correctPassword(req.body.password, user.password);

        if (result) {
            createSendToken(user, 200, res);
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Incorrect username or password'
            });
        };
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    };
};



//createToken('123');


// Authorisation


// Generate token

// Verify token

// Signup

// Login
