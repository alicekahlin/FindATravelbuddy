const { values } = require('lodash');
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const traveladdSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: false
    },
    startdate:{
        type: Number,
        required: false
    },
    enddate:{
        type: Number,
        required: false
    },
    minbudget:{
        type: Number,
        required: false
    },
    maxbudget:{
        type: Number,
        required: false
    },
    description:{
        type: String,
        required: true
    },
    creatorId: { 
        type: String, 
        required: true
    },
    creatorName:{
        type: String, 
        required: true
    },
    creatorGender:{
        type: String, 
        required: true
    },
    creatorAge:{
        type: String, 
        required: true
    },
}, {timestamps: true});


const Traveladd = mongoose.model('Traveladd', traveladdSchema);
module.exports= Traveladd;
