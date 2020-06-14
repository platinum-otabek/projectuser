const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//models
const User = require('../model/User');

//register
router.get('/register',(req,res,next)=>{
    res.render('register');
});

router.post('/register',(req,res,next)=>{
    const {name,username,email,password,password2} = req.body;

    //checking
    req.checkBody('name','Ism majburiy').notEmpty();
    req.checkBody('username','username majburiy').notEmpty();
    req.checkBody('email','email majburiy').isEmail();
    req.checkBody('password','Parol majburiy').notEmpty();
    req.checkBody('password2','Password to`g`ri kelmadi').equals(req.body.password);
    const errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors:errors
        });
    }else{
        const newUser = User({
            name:name,
            email:email,
            username:username,
            password:password
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password, salt, (err,hash)=>{
                if(err)
                    console.log(err);
                newUser.password = hash;

                newUser.save((err)=>{
                    if(err)
                        console.log(err);
                    else{
                        req.flash('success','Siz muvaffaqiyatli ro`yxatdan o`tdingiz');
                        res.redirect('/login');
                    }
                })
            })
        })
    }

});


//GET login
router.get('/login',(req,res,next)=>{
    res.render('login');
});

//POST login
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true,
    })(req,res,next);
});
//logout GET
router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash('success','Tizimdan muvaffaqiyatli chiqdingiz');
    res.redirect('/login');
});
module.exports = router;
