
const User = require("../models/User");
const fs = require("fs")
const Uuid = require("uuid")
require("dotenv").config()

class FileController {

    async uploadAvatar(req, res){
        try {
            const file = req.files.file;
            const user = await User.findById(req.user.id)
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(req.pathStatic + "\\" + avatarName)
            console.log(file.mv(req.pathStatic + "\\" + avatarName))
            user.avatar = avatarName;
            console.log(req.pathStatic)
            console.log(req.pathStatic + "\\" + avatarName)
            await user.save();
            console.log(user)
            return res.json(user)
        } catch(e){
            console.log(e)
            return res.status(400).json({message: "Upload avatar error"})
        }
    }
    
    async deleteAvatar(req, res){
        try {
            const user = await User.findById(req.user.id)
            console.log( fs.unlinkSync(req.pathStatic + "\\" + user.avatar))
            fs.unlinkSync(req.pathStatic + "\\" + user.avatar)
            
            user.avatar = null
            
            await user.save();
            return res.json(user)
        } catch(e){
            console.log(e)
            return res.status(400).json({message: "Delete avatar error"})
        }
    }
} 


module.exports = new FileController();
