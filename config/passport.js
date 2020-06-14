const LocalStrategy = require('passport-local').Strategy;
const config = require('./database');
const bcrypt = require('bcryptjs');
//model
const User = require('../model/User');

module.exports = (passport) =>{
    passport.use(new LocalStrategy((username,password,done)=>{
        const un = {username:username};
        User.findOne(un,(err,user)=>{
            if(err)
                throw err;
            if(!user)
                done(null,false,{message:'Foydalanuvchi topilmadi!'});
            if(user){
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err)
                        throw err;
                    if(isMatch)
                        done(null,user)
                    else
                        done(null,false,{message:'Notog`ri parol'})
                })
            }

        })
    }));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user)=> {
            done(err, user);
        });
    });
}
