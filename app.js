const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// DB connection --------------
const db = require('./helper/db')();
// DB connection finish ------------

//express 
const app = express();

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//models
const User = require('./model/User');

// set static folder
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
// list of users
app.get('/',(req,res)=>{
    const allUsers = User.find({},(err,users)=>{
        res.render('index',{
            title:'Users',
            users:users
        });
    })
});
// add new user content -----
app.get('/users/add',(req,res)=>{
    res.render('add-user',{
        title:'Add-User'
    });
});

app.post('/users/add',(req,res)=>{
    const user = new User();
    user.title = req.body.title;
    user.author = req.body.author;
    user.body = req.body.body;

    user.save((err)=>{
        if(err)
            console.log(err);
        else{
            res.redirect('/');
        }
    });
});

// finish add new user content -----

//delete user ----
app.get('/users/delete/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
            console.log(err);
        res.redirect('/');
    });
});
//delete user ----

// update user content
app.get('/users/update/:id',(req,res)=>{
    const allUsers = User.findById(req.params.id,(err,user)=>{
        res.render('update-user',{
            title:'Update user',
            user:user
        });
    })
});

app.post('/users/update/:id',(req,res)=>{
    const allUsers = User.findByIdAndUpdate(req.params.id,req.body,(err,data)=>{
        if(err)
            console.log(err);
        else{
            res.redirect('/');
        }
    })
});






app.listen(8000,()=>{
    console.log('8000 is listening you..');
    
})