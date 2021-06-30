const mongoose = require('mongoose');
const crypto = require('crypto');
const { argon2id, argon2Verify } = require('hash-wasm');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: [true, 'Nickname is required'],
        maxLength: [18, 'Maximum length of 20 characters'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        maxLength: [40, 'Maximum length of 20 characters'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minLength: [12, 'Minimum length of 12 characters'],
        maxLength: [20, 'Maximum length of 20 characters'],
        required: [true, 'Password is required'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required'],
        validate: {
            validator: function () { return this.password === this.passwordConfirm },
            message: 'Passwords must match'
        },
        select: false
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = new Uint8Array(16);

    await crypto.randomFill(salt, (err, buf) => {
        if (err) throw err.message;
    });

    this.password = await argon2id({
        password: this.password,
        salt,
        parallelism: 2,
        iterations: 512,
        memorySize: 1024,
        hashLength: 32,
        outputType: 'encoded'
    });

    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function (candidate, userPassword) {
    return await argon2Verify({ password: candidate, hash: userPassword });
};

userSchema.methods.passwordChangedCheck = function (candidate) {
    //candidate = jwt iat timestamp from the provided token
    return candidate > Math.trunc(this.passwordChangedAt.getTime() / 1000);
};

const User = mongoose.model('User', userSchema);

module.exports = User;