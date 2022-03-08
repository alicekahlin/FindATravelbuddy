const User = require('../models/User')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email')

//handle errors
const handleErrors = (err) => {
    let errors = { email: '', password: '' };

    //Duplicate error code 11000
    if (err.code === 11000) {
        errors.email = 'Email is already registered'
        return errors;
    }

    //Validation errors 
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'travelbuddy secret', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('auth/signup', { title: 'Sign Up' });
}

module.exports.login_get = (req, res) => {
    res.render('auth/login', { title: 'Log In' });
}

module.exports.signup_post = async(req, res) => {
    const { email, password, firstName, lastName, gender, birthdate } = req.body;

    try {
        const user = await User.create({ email, password, firstName, lastName, gender, birthdate });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async(req, res) => {
    const { email, password, firstName, lastName, gender, birthdate } = req.body;
    try {
        const user = await User.login(email, password, firstName, lastName, gender, birthdate);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.forgot_password_get = (req, res) => {
    res.render('password/forgot-password', { title: 'Forgot Password' });
}

module.exports.forgotPassword = async(req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).json("Error");
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `Have you forgot your password? Please follow the link and reset your password: \n ${resetURL} \n 
        If this request was not from you, please ignore this email. The reset key will be expired in 10 minutes \n 
        Have a great trip, \n
        TravelBuddy`;

        try {

            await sendEmail({
                email: user.email,
                subject: "Your password reset token (valid for 10 min)",
                message
            });

            res.redirect('/')

        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return next();
        }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.reset_password_get = (req, res) => {
    res.render('password/reset-password', { title: 'Reset Password' });
}

const crypto = require('crypto');
module.exports.resetPassword = async(req, res, next) => {
    try {

        const hasedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hasedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ errors });
            return next();
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
        res.redirect('/login')

    } catch {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}