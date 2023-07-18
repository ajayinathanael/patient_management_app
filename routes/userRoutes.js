
const User = require('../model/userModel');
const slug = require('slugify');
const multer = require('multer');
const sharp = require('sharp');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
    // to locate destination of a file which is being uploaded
    destination: function(res, file, callback){
        callback(null,'./public/uploads');
    },

    // add back the extension to the file name
    filename: function(res, file, callback){
        callback(null, file.originalname);
    },

})

// upload parameters for multer for uploading images
const upload = multer({
    // multer will only accept files with these extensions
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 3,
    },
})

// GET ROUTES
router.get('/', async(req,res,next)=>{
    
    doc = await User.find();
    
    if(!doc){
        return next(err);
    }
 
    res.render('index', {patient:doc});


});

router.get("/view_patient/:id", async(req,res)=>{ 
    const detail = req.params.id;
    let patient = await User.findOne({_id: detail});
    res.render('PatientDetails', {patient:patient});
});

router.get("/add_patient", (req,res)=>{
    res.render('myNew');
});

router.get('/editPatient/:id', async(req,res)=>{ // /editStaff/:id
    const requestedPatient = req.params.id;
    let patient = await User.findOne({_id: requestedPatient});
    res.render("myEdit", {patient:patient}); 
});


// POST, UPDATE AND DELETE ROUTES
router.put('/editPatient/:id', upload.single('photo'), async(req,res,next)=>{
 
    // await sharp(req.file.buffer) //sharp for file reduction, the file is in a buddfer
    // .resize(500, 500) //width, height
    // .toFormat('jpeg')
    // .jpeg({ quality: 90 }) 
    // .toFile(`public/uploads/${req.file.filename}`);

    // next();

    const newPatient =  ({
        surname: req.body.surname,
        firstname: req.body.firstname,
        dateOfBirth: req.body.dateOfBirth,
        HomeAddress: req.body.HomeAddress,
        occupation: req.body.occupation,
        nameOfIllness: req.body.nameOfIllness,
        photo: req.file.filename
    });

    try{
        const doc = await User.findByIdAndUpdate(req.params.id, newPatient,{
            new: true});
        res.redirect('/');
    }
    catch(err){
        res.send(err);
    } 
});


router.post('/add_patient', upload.single('photo'), async(req,res)=>{
    
    // await sharp(req.file.buffer) //sharp for file reduction, the file is in a buddfer
    // .resize(500, 500) //width, height
    // .toFormat('jpeg')
    // .jpeg({ quality: 90 }) 
    // .toFile(`public/uploads/${req.file.filename}`);

    
    let PatientDetails = ({
        surname: req.body.surname,
        firstname: req.body.firstname,
        dateOfBirth: req.body.dateOfBirth,
        HomeAddress: req.body.HomeAddress,
        occupation: req.body.occupation,
        nameOfIllness: req.body.nameOfIllness,
        photo: req.file.filename

    });
    
    try{
        const newUser = await User.create(PatientDetails); 
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
    // next();
    
});

router.delete('/:id', async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);

    res.redirect('/');

});


module.exports = router;