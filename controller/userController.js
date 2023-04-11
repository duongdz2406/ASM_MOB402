const express = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const app = express();

const validateRegister = [
    check('name')
      .notEmpty().withMessage('Tên đăng nhập không được để trống')
      .isLength({ min: 3, max: 20 }).withMessage('Tên đăng nhập phải từ 3 đến 20 kí tự'),
    check('email')
      .notEmpty().withMessage('Email không được để trống')
      .isEmail().withMessage('Email không hợp lệ'),
    check('password')
      .notEmpty().withMessage('Mật khẩu không được để trống')
      .isLength({ min: 6, max: 20 }).withMessage('Mật khẩu phải từ 6 đến 20 kí tự')
      .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số'),
    
  ];
 
    // login
app.get("/signin",function(req,res){
    res.render('signin');
});
app.post("/signin", async (req,res) =>{
    // const { email, password } = req.body;

    // Tìm kiếm thông tin người dùng trong cơ sở dữ liệu
    const user = await userModel.findOne({ email:req.body.email });
    if (!user) {
        // Nếu không tìm thấy người dùng, trả về thông báo lỗi
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }
      
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        // Nếu mật khẩu không khớp, trả về thông báo lỗi
        return res.status(401).json({ message: 'Mật khẩu không đúng' })}
        if(user){
            // userModel.find({}).then(users=>{
            //     res.render('index',{
            //         users:users.map(user=>user.toJSON())
            //     });
            // })
            res.redirect('/user/list')
        }
});

    //list user
app.get("/list",(req,res)=>{
    userModel.find({}).then(users=>{
        res.render('index',{
            users:users.map(user=>user.toJSON())
        });
    })
});

    //register
app.get("/signup",function(req,res){
    res.render('signup');
});
app.post("/signup",validateRegister,async(req,res)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    const email = req.body.email;

  // Kiểm tra email trùng lặp trong cơ sở dữ liệu
  userModel.findOne({ email: email }, async(err, user)=> {
    if (err) {
      console.log(err);
      res.redirect('/user/signup');
    } else if (user) {
      console.log('Email đã được sử dụng. Vui lòng nhập email khác.');
      return res.status(401).json({ message: 'Email đã được sử dụng. Vui lòng nhập email khác.' })
      res.redirect('/user/signup');
    } else {
        const u = new userModel(req.body);
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        u.password = await bcrypt.hash(u.password, salt);
        try{
            await u.save();
            res.render('signin');
           
        }catch(error){
            res.status(500).send(error);
        }
    }
  });
})

    //add user
app.get("/them",(req,res)=>{
   res.render('add')
    })
    
app.post('/add', async(req,res)=>{
    console.log(req.body);
    if(req.body.id ==''){
        //add
        addRecord(req,res);
    }else{
        //update
        updateRecord(req,res);
    }
});

    //edit user
app.get('/edit/:id', (req,res)=>{
    userModel.findById(req.params.id,(err,data)=>{
        
      if(!err){
        res.render('add',{
            user : data.toJSON()
        })
      }      
                 
    })
   
})
        // ham add
async function addRecord (req,res){
    const u = new userModel(req.body);
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    u.password = await bcrypt.hash(u.password, salt);
    try{
         u.save();
        res.render('add');
        res.redirect('/user/list')
    }catch(error){
        res.status(500).send(error);
    }
}
    //ham update
function updateRecord(req,res){
    userModel.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('/user/list')
        }else{
            console.log(err);
            res.render('add');
        }
    })
}
    //delete user
app.get('/delete/:id',async(req,res)=>{
    try {
        const user = await userModel.findByIdAndDelete(req.params.id,req.body);
        if(!user) res.status(404).send("no item found")
        else{
            res.redirect('/user/list')
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports =app;