
const FileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const fs = require("fs")
const Uuid = require("uuid")

class FileController {
    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, user: req.user.id})
            const parentFile = await File.findOne({_id: parent})

            if(!parentFile) {
                file.path = name
                await FileService.createDir(req, file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await FileService.createDir(req, file)
                parentFile.childs.push(file._id);
                await parentFile.save()
            }
            await file.save();
            return res.json(file);
        }catch(e) {
            console.log("errorcreate")
            return res.status(400).json(e)
        }
    }


    async getFiles(req, res){
        try {
            const files = await File.find({user: req.user.id, parent: req.query.parent})
            return res.json(files)
        } catch(e){
            console.log(e)
            return res.status(500).json({message: "Can not get files "})
        }
    }

    async uploadFiles(req,res) {
        try {
            const file = req.files.file

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({message: 'There no space on the disk'})
            }

            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${req.filePath}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${req.filePath}\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'File already exist'})
            }
            file.mv(path)

            const type = file.name.split('.').pop()
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async uploadAvatar(req, res){
        try {
            const file = req.files.file;
            const user = await User.findById(req.user.id)
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(process.env.staticPath + "\\" + avatarName)
            user.avatar = avatarName;
            await user.save();
            return res.json(user)
        } catch(e){
            console.log(e)
            return res.status(400).json({message: "Upload avatar error"})
        }
    }

    async deleteAvatar(req, res){
        try {
            const user = await User.findById(req.user.id)
            fs.unlinkSync(process.env.staticPath + "\\" + user.avatar)
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