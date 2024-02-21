const Router = require("express");
const User = require("../models/User");
const Tovar = require('../models/Cart');
const router = new Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware")
const Order  = require("../models/Order");
const fs = require("fs")
require("dotenv").config()

router.post("/registration", 
    [
        check("email", "Uncorrect email").isEmail(),
        check("password", "Password must be longer than 3 and shorter than 12").isLength({min:3, max:12}),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({message: "Uncorrect request", errors})
        }

        const {email, password, gender, bonus} = req.body

        const candidate = await User.findOne({email})

        if(candidate) {
            return res.status(400).json({message:  `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 9)
        
        const user = new User({email, password: hashPassword, gender, bonus})
        await user.save()
        return res.json({message: "User was created"})
    } catch(e) {
        res.send({message:"Server error"})
    }
})

router.post("/login", 
    async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid) {
            return res.status(400).json({message: "Invalid password"})
        }
        const token = jwt.sign({id: user.id}, process.env.secretKey, {expiresIn: '1h'})
        return res.json({
            token,
            user:{
                name: user.name,
                id:user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
                userSale: user.userSale, 
                adress: user.adress,
                order: user.order,
                bonus: user.bonus,
                cachback:user.cachback
            }
        })
    }catch(e) {
        console.log(e)
        res.send({message:"Server error"})
    }
})

router.get("/auth", authMiddleware,

    async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id})
        
        const token = jwt.sign({id: user.id}, process.env.secretKey, {expiresIn: '1h'})
        return res.json({
            token,
            user:{
                id:user.id,
                email: user.email,
                diskSpace: user.diskSpace, 
                usedSpace: user.usedSpace,
                avatar: user.avatar,
                userSale: user.userSale,
                adress: user.adress,
                order: user.order,
                bonus: user.bonus,
                cachback: user.cachback
            }
        })
    }catch(e) {
        res.send({message:"Server error"})
    }
})

router.post("/change", authMiddleware,

    async (req,res) => {
        try {
            
            const {password, newPassword} = req.body;
            
            const user = await User.findOne({_id: req.user.id})
            const isPassValid = bcrypt.compareSync(password, user.password)

            if(!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            } else {
                const hashPassword = await bcrypt.hash(newPassword, 9)
                user.password = null;
                user.password = hashPassword;
            }
            user.save()
            return res.json({message: "Password has been change"})
        } catch(e) {
            res.send({message: "Error change password"})
        }
})



router.delete("/delete", authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne(({_id: req.user.id})); 
            if(user) {
                
                await User.deleteOne({ _id: user.id })
            }
            if (!user) {
                return res.status(404).json({message: "User not found"});
            }
            res.json({message: "Deleted user"});

        } catch(e) {
            console.error(e); 
            res.status(500).json({message: "Server error"}); 
        }
    }
);




router.post("/comment", authMiddleware, async (req, res) => {
    try {
        const { arr, id } = req.body;

        const tovar = await Tovar.findOne({ _id: id });
        const newArr = tovar.reviews.concat(arr);
        tovar.reviews = newArr
        await tovar.save();
        return res.json({ message: "Comment push" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});
 



router.get("/tovar", async (req, res) => {
    try {
        const tovars = await Tovar.find();
        res.json(tovars); 
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении товаров' }); 
    }
});


router.get(`/card/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const tovar = await Tovar.findOne({ id: id });
        if (!tovar) {
            return res.status(404).json({ error: 'Товар не найден' });
        }
        res.json(tovar);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении товара' });
    }
});


router.get(`/card`, async (req, res) => {
    try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const tovars = await Tovar.find().limit(limit);
        res.json(tovars);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении товаров' });
    }
});

router.get(`/card-sort`, async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 15;
        const gender = req.query.gender ? req.query.gender : 'male'; 
        const sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt'; 
        
        const query = { gender: gender };
        const tovars = await Tovar.find(query).sort({ [sortBy]: -1 }).limit(limit);
        res.json(tovars);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении товаров' });
    }
});

router.post("/adress", authMiddleware,

    async (req, res) => {
    try {
        const { adress } = req.body; 
        console.log(adress)
        const user = await User.findOne({_id: req.user.id})

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.adress = adress;
        
        await user.save(); 

        return res.json({user});
    } catch (e) {
        console.error(e); 
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/order", async (req, res) => {
    try {
        const { dataOrder, email, sale, bonus} = req.body;

        const user = await User.findOne({ email });

        if(user) {
            user.userSale =  user.userSale - sale;
            await user.save();
            if(user.order) {
                user.order.push(dataOrder)
            } else {
                user.order = dataOrder;
            }
            let numberOrder = user.order.length;

            if(numberOrder < 5) {
                user.cachback = 1
            } else if((numberOrder >= 5) && (numberOrder < 15)) {
                user.cachback = 2
            } else if(numberOrder >= 15) {
                user.cachback = 3
            }
            user.userSale = user.userSale +  bonus.balls;
            user.bonus.push(bonus);
            await user.save();
        }
        const order = await new Order({...dataOrder})
        await order.save()

        return res.json({user});
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router