const express = require('express');
const expressHbs= require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const url = "mongodb+srv://duongddtph24297:duongto12@cluster0.teophxq.mongodb.net/test?retryWrites=true&w=majority"

const useController = require("./controller/userController");
const productController = require('./controller/productController');



app.use(express.json());

mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());


app.use(express.static('css'));


//route

app.use('/user',useController);
app.use('/product',productController);

app.listen(8080,()=>{
    console.log("Sever is running")
});

app.engine('.hbs',expressHbs.engine({extname:'.hbs',defaultLayout:'main' }));
app.set('view engine',".hbs");


app.get('/logout', function(req, res) {
    req.logout(function(err) {
      if (err) {
        console.log(err);
        res.redirect('/user/list');
      } else {
        res.redirect('/user/signin');
      }
    });
  });
         
         

