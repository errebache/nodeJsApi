const  express = require("express");
const router = express.Router();
const  passport  = require("passport");
const jwt  = require("jsonwebtoken");    
const User = require("../../models/user");
const config  = require( "../../config/database");

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
});

const fileFilter = (req ,file, cb) => {
   if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
     cb(null,true)  
   } else {
    cb(null,false);
   }

};
 
var upload = multer({ 
    storage: storage ,
    limits : {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//Register
router.post('/register', upload.single('pictureUrl'),(req,res,next) => {

    const host = req.host+':3000';
    const filePath = req.protocol + "://" + host + '/' + req.file.path;
    
    let newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        birthday:req.body.birthday,
        username:req.body.username,
        password:req.body.password,
        pictureUrl:filePath
    });
    
    User.addUser(newUser,(err,user) => {
        if(err) {
            console.log(err);
            res.json({success:false,msg:"erreur d'enregistrement"});
        } else {
            res.json({success:true,msg:"enregistrement avec succé"});
        }
    })

})


router.post('/login',(req,res,next) => {
 
     const username = req.body.username;
     const password = req.body.password;

     console.log(password);

     User.getUserByUsername(username,(err,user) => {

        if(err) throw err;

        if(!user) {
            res.json({success:false,msg:"User Not Found"});
          }
        
          User.comparePassword(password,user.password,(err,isMatch) => {
              
            if(err) throw err;

            if(isMatch) {
                const token = jwt.sign({data:user},config.secret,{
                    expiresIn:604800 // 1 week
                });
                
                res.json({
                    success:true,
                    token:`JWT ${token}`,
                    user:{
                        _id:user.id,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        email:user.email,
                        birthday:user.birthday,
                        username:user.username,
                        pictureUrl:user.pictureUrl
                    }
                })
            } else {
                return res.json({success:false,msg:'password invalid'});
            }

          });
          
    })
  
    
     

})

//Profil -- Authorization value jwt or Bearer

router.get('/profil',passport.authenticate('jwt',{session: false}),(req,res,next) => {
        
    res.json({
      user:{
        _id: req.user.id,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        email:req.user.email,
        birthday:req.user.birthday,
        username:req.user.username,
        pictureUrl:req.user.pictureUrl
      }
    });
});

module.exports = router;
