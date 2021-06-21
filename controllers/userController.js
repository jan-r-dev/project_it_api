const User = require('../models/userModel');

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: newUser
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        });
    };
};

exports.getSingleUser = async (req, res, next) => {
    try {
        const retrievedUser = await User.findById(req.params.id);

        res.status(201).json({
            status: 'success',
            data: retrievedUser
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err.message
        });
    };
};

// Only for nickname changes
exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await Project.findByIdAndUpdate(req.params.id, { nickname: req.body.nickname }, {
            new: true,
            runValidators: true
        });

        res.status(201).json({
            status: 'success',
            data: updatedUser
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    };
};

exports.checkPass = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('+password');

        const result = await user.correctPassword(req.body.password, user.password);

        if (result) {
            res.status(201).json({
                status: 'success',
                message: 'Password matches'
            });
        } else {
            res.status(401).json({
                status: 'fail',
                message: 'Incorrect username or password'
            });
        };
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    };
};