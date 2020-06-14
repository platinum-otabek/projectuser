const express = require('express');
const path = require('path');
const passport = require('passport');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


 
// DB connection -ok-------------
const db = require('./helper/db')();
// DB connection finish ------------

//express  
const app = express();

//body parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//cookie parser
app.use(require('cookie-parser')());
//models
const Book = require('./model/Book');


// set static folder
app.use(express.static(path.join(__dirname,'public'))); 
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
//express messages
app.use(require('connect-flash')());
app.use((req,res,next)=>{
    res.locals.messages = require('express-messages')(req,res);
    next();
});

//express validator
app.use(expressValidator({
    errorFormatter: (param,msg,value) => {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() +']';
        }
        return {
            param:formParam,
            msg:msg,
            value:value
        }
    }
}))

//passport init
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null;
    next();
}); 
// list of books
app.get('/',(req,res)=>{
    const allBooks = Book.find({},(err,books)=>{
        res.render('index',{
            title:'Kitoblar',
            books:books
        });
    })
});


const books = require('./routes/book');
app.use('/', books);
const users = require('./routes/user');
app.use('/', users);


app.listen(3000,()=>{
    console.log('8000 is listening you..');
    
})