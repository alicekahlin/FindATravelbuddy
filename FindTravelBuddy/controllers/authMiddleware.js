const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Traveladd = require('../models/traveladd');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; 
    //check if token exsits and verified
    if(token){
        jwt.verify(token, 'travelbuddy secret', (err, decodedToken) => {
            if(err){
                res.redirect('/login')
            }else{
                next(); 
            }
        })
    }else{  
        res.redirect('/login')
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt; 
    if(token){
        jwt.verify(token, 'travelbuddy secret', async (err, decodedToken) => {
            if(err){
                res.locals.user = null; 
                next(); 
                
            }else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;

                next();

            }
        })
    }else{
        res.locals.user = null; 
        next();
    }
}

module.exports = { requireAuth, checkUser };

