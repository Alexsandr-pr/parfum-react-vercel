

const {Schema, model} = require("mongoose")

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default:0},
    avatar: {type:String},
    userSale: {type:Number, required: true, default: 100},
    gender: {type:String, required:true},
    adress: {type:Object, required:false},
    order: {type:Array, required:false},
    bonus: {type:Array, required:false},
    cachback: {type: Number, required:true, default: 1},
}) 

module.exports = model("User", User);
