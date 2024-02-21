const {Schema, model} = require("mongoose")

const Order = new Schema({
    id:{type:String, required:false},
    name: {type: String, required: true},
    surname: {type:String, required: true},
    country: {type:String, required: true},
    adress: {type:String, required: true},
    locality: {type:String, required: true},
    region: {type:String, required: true},
    zip: {type:Number, required: true},
    tel: {type:Number, required: true},
    email: {type: String, required: true},
    inscription: {type: String, required: false},
    dataOrder: {type:Array, required:true},
    allPrice: {type:Number, required: true},
    completed:{type:Boolean, required: true, default:true},
    timeOrder: {type:Date, required:true}
}) 

module.exports = model("Order", Order);