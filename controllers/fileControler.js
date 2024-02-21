
const User = require("../models/User");
const fs = require("fs")
const Uuid = require("uuid")
require("dotenv").config()
const path = require('path');

class FileController {
    /*
    async uploadAvatar(req, res){
        try {
            const file = req.files.file;
            const user = await User.findById(req.user.id)
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(req.pathStatic + "\\" + avatarName)
            user.avatar = avatarName;
            
            console.log(req.pathStatic)
            console.log(req.pathStatic + "\\" + avatarName)
            await user.save();
            return res.json(user)
        } catch(e){
            console.log(e)
            return res.status(400).json({message: "Upload avatar error"})
        }
    }
    */
    async uploadAvatar(req, res){
        try {
        const file = req.files.file;
        const user = await User.findById(req.user.id);
        const avatarName = Uuid.v4() + ".jpg";
        // Полный путь к файлу, используя путь к статик папке
        const filePath = path.join(req.pathStatic, avatarName);
        console.log(filePath)
        // Переместить файл в папку статик
        await file.mv(filePath);
        // Обновить путь аватара пользователя
        user.avatar = avatarName;
        console.log(req.pathStatic);
        console.log(filePath);
        await user.save();
        return res.json(user);
        } catch(e){
        console.log(e);
        return res.status(400).json({message: "Upload avatar error"});
        }
        }
    
    
    async deleteAvatar(req, res){
        try {
            const user = await User.findById(req.user.id)
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