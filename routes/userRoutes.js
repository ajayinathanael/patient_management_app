
const User = require('../model/userModel');
const slug = require('slugify');
const multer = require('multer');
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


// POST, UPDATE AND DELETE ROUTES
router.post('/add_patient', upload.single('photo'), async(req,res)=>{
    
    
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
    
});

router.delete('/:id', async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);

    res.redirect('/');

});

router.put('/:id', async(req,res)=>{

    // /edit_patient/:surname

    // const newPatient =  ({
    //     surname: req.body.surname,
    //     firstname: req.body.firstname,
    //     dateOfBirth: req.body.dateOfBirth,
    //     HomeAddress: req.body.HomeAddress,
    //     occupation: req.body.occupation,
    //     nameOfIllness: req.body.nameOfIllness
    //     // photo: req.file.filename

    // });
    
    req.patient = await User.findById(req.params.id);

    // req.params.id = req.patient.id;

    let patient = req.patient;
  
    patient.surname = req.body.surname;
    patient.firstname = req.body.firstname;
    patient.dateOfBirth = req.body.dateOfBirth;
    patient.HomeAddress = req.body.HomeAddress;
    patient.occupation = req.body.occupation;
    patient.nameOfIllness = req.body.nameOfIllness;
    
    // console.log(patient.firstname);
    // const doc = await User.findByIdAndUpdate(req.params.id, req.body);

    try{
        patient = await patient.save();
        //now redirect to the view route
        // console.log(patient);
        res.redirect('/');
    }catch(err){
        console.log(err);
        // res.redirect(`/blogs/edit/${blog.id}`, {blog:blog});
        // redirect to the edit route
    }

});



module.exports = router;