const express = require('express');
const ProductModel = require('../models/product');

const app = express();

 


app.get("/list",(req,res)=>{
    ProductModel.find({}).then(products=>{
        res.render('index2',{
            products:products.map(product=>product.toJSON())
        });
    })
});

app.get("/them",(req,res)=>{
   res.render('add_product')
    })
    


app.post('/add_product', async(req,res)=>{
    console.log(req.body);
    if(req.body.id ==''){
        //add
        addRecord(req,res);
    }else{
        //update
        updateRecord(req,res);
    }

   
});
app.get('/edit/:id', (req,res)=>{
    ProductModel.findById(req.params.id,(err,data)=>{
        
      if(!err){
        res.render('add_product',{
            product : data.toJSON()
        })
      }      
                 
    })
   
})
async function addRecord (req,res){
    const p = new ProductModel(req.body);
   
    try{
         p.save();
        res.render('add_product');
        res.redirect('/product/list')
    }catch(error){
        res.status(500).send(error);
    }
}
function updateRecord(req,res){
    ProductModel.findOneAndUpdate({_id:req.body.id},req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('/product/list')
        }else{
            console.log(err);
            res.render('add_product');
        }
    })
}

app.get('/delete/:id',async(req,res)=>{
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id,req.body);
        if(!product) res.status(404).send("no item found")
        else{
            res.redirect('/product/list')
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports =app;