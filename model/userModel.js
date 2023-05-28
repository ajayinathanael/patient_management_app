const mongoose = require('mongoose');
const validator = require('validator');
const slug = require('slugify');

// MODEL
const userSchema = new mongoose.Schema({
    
    surname: {
        type: String,
        required: [true, 'Please tell us your surname!']
    },   
    firstname: {
        type: String,
        required: [true, 'Please choose a firstname!']
    },
    dateOfBirth: {
        type: String
    },
    HomeAddress: {
        type: String,
    },
    occupation: {
        type: String,
    },
    nameOfIllness:{
        type: String
    },
    photo:{
        type: String,
        default: 'default.jpg'
    },
});

const User = mongoose.model('patient_users', userSchema);

module.exports=User;
