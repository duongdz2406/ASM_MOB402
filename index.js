var express = require('express');
var expressHbs= require('express-handlebars');
var cors = require('cors');
var dotenv = require('dotenv');
var mongoose =require('mongoose');
var cookieParser = require('cookie-parser');
var authRoute = require("./routes/auth");
const bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
dotenv.config();

mongoose.connect(process.env.MONGODB_URL,()=>{
    console.log("CONECTED TO MONGO DB")
})

app.use(express.static('css'));
app. use(cors());
app.use(cookieParser());
app.use(express.json());

//route
app.use("/v1/auth",authRoute);


app.listen(8080,()=>{
    console.log("Sever is running")
});

app.engine('.hbs',expressHbs.engine({extname:'.hbs',defaultLayout:'main' }));
app.set('view engine',".hbs");
app.get('/',function(req,res){
    res.render('signin'
        
    );
});
app.get('/signup',function(req,res){
    res.render('signup')
        
    })
    app.get('/index',function(req,res){
        res.render('index',{
            showUser : true
        })
            
        })
        var posts = [];
        app.post('/create', function (req, res) {
            posts.push(req.body)
           console.log(req.body)
           res.redirect('/index');

           
         })
        app.get('/create', function (req, res) {
            res.render('defaultView',{
               showCreateUser :true,
               id:req.body.id,
               name: req.body.name
            })
         })
         
         

