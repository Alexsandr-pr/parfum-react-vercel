
const User = require("../models/User");
const fs = require("fs")
const Uuid = require("uuid")
require("dotenv").config()
const path = require('path');

class FileController {
    async uploadAvatar(req, res){
        try {
            const file = req.files.file;

            const user = await User.findById(req.user.id);

            const avatarName = Uuid.v4() + ".jpg";

            // Полный путь к файлу, используя путь к статик папке
            const filePath = path.join(req.pathStatic, avatarName);

            // Переместить файл в папку статик
            await file.mv(filePath);

            // Обновить путь аватара пользователя
            user.avatar = avatarName;

            await user.save();

            return res.json(user);
        } catch(e){
            console.log(e);
            return res.status(400).json({message: "Upload avatar error"});
        }
        }
    
    
        /*
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
    */

    //async deleteAvatar(req, res){
        //try {
          //  const user = await User.findById(req.user.id)
          //  fs.unlinkSync(req.pathStatic + "\\" + user.avatar)
           // user.avatar = null
           // await user.save();
           // return res.json(user)
       // } catch(e){
            //console.log(e)
            //return res.status(400).json({message: "Delete avatar error"})
        //}
   // }
    
    

   // async deleteAvatar(req, res){
     //   try {
            // Найти пользователя по идентификатору
          //  const user = await User.findById(req.user.id);
            // Удалить файл аватара из папки статик
         //   fs.unlinkSync(req.pathStatic + "\\" + user.avatar);
            // Удалить ссылку на аватар у пользователя в базе данных
         //   user.avatar = null;
            // Сохранить обновленную информацию о пользователе
         //   await user.save();
            // Отправить ответ с обновленной информацией о пользователе
        //    return res.json(user);
      //  } catch(e){
      //      console.log(e);
        //    return res.status(400).json({message: "Delete avatar error"});
       // }
   // }
    
    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user || !user.avatar) {
                return res.status(404).json({ message: "User or avatar not found" });
            }
            
            const filePath = path.join(req.pathStatic, user.avatar);
            fs.unlinkSync(filePath); 
            user.avatar = null;
            await user.save(); 

            return res.json(user);
        } catch (error) {
            console.error("Delete avatar error:", error);
            return res.status(400).json({ message: "Delete avatar error" });
        }
    }
} 


module.exports = new FileController();