const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    masp:{
        type:String
    },
    tensp:{
        type:String
    },
    gia:{
        type:Number
    }
})

const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;
