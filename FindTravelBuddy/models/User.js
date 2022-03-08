const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password is too short, needs to be at least 6 charachters'],
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    homeCountry: {
        type: String,
        default: ""
    },
    homeCountryShort: {
        type: String,
        default: ""
    },
    birthdate: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    about: {
        type: String,
        default: ""
    },
    profilepicture: {
        data: {
            type: Buffer,
            default: ""
        },
        filetype: {
            type: String,
            default: ''
        },
        filename: {
            type: String,
            default: ''
        }
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    }
})


//fire a function before doc saved to db
userScheme.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to log in user
userScheme.statics.login = async function(email, password, firstName, lastName, gender, birthdate) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const crypto = require('crypto');
userScheme.methods.createPasswordResetToken = function() {
    const number_of_charecters = 32;
    const resetToken = crypto.randomBytes(number_of_charecters).toString('hex');

    //sha256 någon algoritm
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const time_ = 10 * 60 * 1000; //10 minuter i ms
    this.passwordResetExpires = Date.now() + time_;

    return resetToken;
}

const User = mongoose.model('user', userScheme);
module.exports = User;