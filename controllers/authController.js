const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const util = require('util');

const retrievePem = async () => {
    const readFile = util.promisify(fs.readFile);
    const key = await readFile(`${__dirname}/../utils/key.pem`, { encoding: 'utf-8' });

    return key;
};

const signToken = async id => {
    const key = await retrievePem();

    return jwt.sign(
        { id: id },
        key,
        {
            algorithm: 'PS512',
            expiresIn: '90d'
        }
    );
};

const createJwtToken = async (user, statusCode, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    };
};

exports.loginUser = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) return next(new Error('Requires email and password'));

        const user = await User.findOne({ email: req.body.email }).select('+password');

        const result = await user.correctPassword(req.body.password, user.password);

        if (result) {
            createJwtToken(user, 200, res);
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

exports.validateAccess = async (req, res, next) => {
    try {
        let token;

        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else {
            throw ('You are not logged');
        };

        // Test if jwt is valid
        const verifyToken = util.promisify(jwt.verify);
        const isValid = await verifyToken(token, await retrievePem(), {
            algorithms: ['PS512']
        });

        // Retrieve user and check if exists
        const user = await User.findById(isValid.id);
        if (!user || !user.active) throw ('User does not exist or has been deactivated');

        // Test if password was changed
        if (user.passwordChangedAt && !user.passwordChangedCheck(isValid.iat)) throw ('Password was changed. Please log in again');

        // Attach user to the request
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    };
};

exports.changePassword = async (req, res, next) => {
    try {
        if (!req.body.password || !req.body.newPassword || !req.body.newPasswordConfirm) throw 'Provide current password, new password, and confirmation';

        const user = await User.findById(req.user.id).select('+ password');
        const passCheck = await user.correctPassword(req.body.password, user.password);
        if (!passCheck) throw 'Incorrect password';

        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.newPasswordConfirm;

        await user.save();
        createJwtToken(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    };
};

exports.forgotPassTokenGenerate = async (req, res, next) => {
    try {
        const forgetfulUser = await User.findOne({ email: req.body.email });

        if (!forgetfulUser) throw ('There is no user with that email');

        const resetToken = forgetfulUser.createPasswordResetToken();
        await forgetfulUser.save({ validateBeforeSave: false });

        // Send token with link to the user's email
        // Not yet implemented

        res.status(200).json({
            status: 'success',
            message: 'Function not yet implemented'
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    };
};