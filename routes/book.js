const express = require('express');
const router = express.Router();

//models
const Book = require('../model/Book');
//User
const User = require('../model/User');
// Ensure Authenticate
const eA = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('danger','Siz ro`yxatdan o`tmagansiz');
        res.redirect('/login');
    }
}

// one book with information
router.get('/book/:id',eA,(req,res)=>{
    Book.findById(req.params.id,(err,book)=>{
        User.findById(book.author,(err,user)=>{
            res.render('book',{
                book:book,
                author:user.name
            });
        })
    })

});


// add new book content -----
router.get('/books/add',eA,(req,res)=>{
    res.render('add-book',{
        title:'Add-Book'
    });
});

router.post('/books/add',eA,(req,res)=>{
    req.checkBody('title','Title qismi kerakli qism!!!').notEmpty();
    // req.checkBody('author','Author qismi kerakli qism!!!').notEmpty();
    req.checkBody('body','Body qismi kerakli qism!!!').notEmpty();
    //errors
    let errors = req.validationErrors();
    if(errors){
        res.render('add-book',{
            title:'Kitob qo`shish',
            errors:errors
        })
    }else{
        const book = new Book();
        book.title = req.body.title;
        book.author = req.user._id;
        book.body = req.body.body;

        book.save((err)=>{
            if(err)
                console.log(err);
            else{
                req.flash('success','Muvaffaqiyatli qo`shildi');
                res.redirect('/');
            }
        });
    } 
});

// finish add new book content -----

//delete book ----
router.delete('/book/:id',eA,(req,res)=>{
    if(!req.user._id)
        res.status(500).send();
    let query = {_id:req.params.id};

    Book.findById(req.params.id,(err,book)=>{
        if(book.author != req.user._id){
            res.status(500).send();
        }
        else {
            Book.deleteOne(query, (err)=>{
                if(err)
                    console.log(err);


                    res.send('Success');

            });
        }
    })

});
//delete book ----

// update book content
router.get('/book/edit/:id',eA,(req,res)=>{
   Book.findById(req.params.id,(err,book)=>{
       if(book.author != req.user._id){
           req.flash('danger','Kitobni o`zgartirishingiz uchun huquqingiz yo`q');
           res.redirect('/');
       }
       else{
           res.render('book_edit',{
               title:'Kitobni yangilash',
               book:book
           });
       }

    })
});

router.post('/book/edit/:id',eA,(req,res)=>{
    const allBooks = Book.findByIdAndUpdate(req.params.id,req.body,(err,data)=>{
        if(err)
            console.log(err);
        else{
            req.flash('success','Kitob muvaffaqiyatli o`zgartirildi');
            res.redirect('/');
        }
    })
});



module.exports = router;