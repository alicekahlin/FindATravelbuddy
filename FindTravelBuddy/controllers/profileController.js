const User = require('../models/User');
const sendEmail = require('../utils/email')
var multer = require('multer');
const sharp = require ('sharp');
const multerStorgage = multer.memoryStorage();

// For upload of image
const multerFilter = (req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

// For upload of image
const upload= multer({
    storage: multerStorgage,
    fileFilter: multerFilter
});

// The profile site
const profile_my =(req,res)=>{
    res.render('profile/profile', {theuser:null, title:'Other Profile'});
}

// Edit profile site
const profile_edit_get = (req,res) =>{
    res.render('profile/editprofile', {title: 'Edit Profile'});
}

// Convert date to numbers
function dateToInt(date) {

    var values = date.split("-"); 
    var year = parseInt(values[0]);
    var month = parseInt(values[1]);
    var totalStartdate = year*100 + month;

    if(values.length === 3){
        var day = parseInt(values[2]);
        totalStartdate = totalStartdate*100 + day;
    }

    return totalStartdate;
}

// Make the edits to the profile
const profile_edit_patch = (req,res) =>{
    const filterBody = filterObj(req.body,'firstName',
        'lastName',
        'gender',
        'about',
        'homeCountry',
        'homeCountryShort'
        );
    if(req.file){
        filterBody.profilepicturename = req.file.filename;
        filterBody.profilepicture = {
            data: new Buffer.from(req.file.buffer, 'base64'),
            filetype: 'jpeg',  
            filename: req.file.filename
        }
    }
     
    filterBody.birthdate = dateToInt(req.body.birthdate);
    User.findByIdAndUpdate(req.body.id, filterBody,{
        new: true,
        runValidators: true
    }) 
    .then(result =>{
        res.redirect('/profile');
    })
    .catch(err=>{ 
        console.log(err);
    });
}

// Allowed edits in the profile
const filterObj=(obj, ...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el];
    })
    return newObj;
};

// Middleware for the upload in router
const uploadPhoto= upload.single("profilepicture");

// Resize and crop the photo
const resizePhoto = (req, res,next)=>{
    if(!req.file){
         return next();
    }
    req.file.filename = `user-${req.body.id}-${Date.now()}.${req.file.mimetype}`;

    sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality: 50})
    .toBuffer();
    next();
};

// The profile of another user
const profile_other = (req,res) =>{
    const id = req.params.id;
    User.findById(id) 
    .then(result =>{
        res.render('profile/profile', {theuser:result, title:'Other Profile'});
    })
    .catch(err=>{
        res.status(404).render('404', {title: "Page not found"});
    });
}

// Delete the profile
const profile_delete = (req,res) =>{

    const id= req.params.id;
    User.findByIdAndDelete(id)
    .then(result =>{
        res.cookie('jwt', '', { maxAge: 1 });
        res.json({redirect: '/'});      
    })
    .catch(err=>{ 
        console.log(err);
    });
}

// Contact another user.
const contactPerson = async (req, res, next) =>{
    
    try{
        const {_csrf} =  req.body;

        const user = await User.findById(_csrf);
        const theuser = await User.findById({_id: req.params.id});

        if(!user){
            res.status(400).json({ errors });
        }

        //3) Send it back as an email
        const message = `Hello ${theuser.firstName}! \n
        ${user.firstName} has send a request to be in contact with you because this person consider you as a possible TravelBuddy. \n
        If you are interested you can contact the user through the email: ${user.email} \n
        Have a great day, and we hope you find your new TravelBuddy! \n \n
        Have a great trip, \n 
        TravelBuddy`; 

        try{
            await sendEmail({
                email: theuser.email, 
                subject: "Someone want to be in contact with you", 
                message
            }); 

            res.redirect('/')

        }catch(err){
            res.status(400).json({ errors });
        }

    }catch(err){
        res.status(400).json({ errors });
    }
    
}

module.exports= {
    profile_my,
    profile_edit_get,
    profile_edit_patch,
    profile_other, 
    contactPerson,
    profile_delete,
    uploadPhoto,
    resizePhoto
}