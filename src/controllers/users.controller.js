const express = require("express")
const User = require("../modals/user.modal")
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

router.post("", 
body("first_name").notEmpty().withMessage("First name is required"),
body("last_name").notEmpty().withMessage("Last name is required"),
body("pincode").notEmpty().withMessage("Pincode is required")
.custom((value) =>{

 

    const isNumber = /^[0-9]*$/.test(value);

 
    if (!isNumber || value <= 0){
        throw new Error("Pincode cannot be negative or equal to zero or cannot be an alphabet")
    } else {
        let j = value.toString();
        if (j.length != 6){
            throw new Error("Pincode length should be 6")
        }
    }
    return true;
}),

body("email").notEmpty().withMessage("Email is required")
.custom((value) => {



    const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);


    if (!isEmail || value <= 0) {
        throw new Error("Enter a proper email")
    } 
    
    return true;
}),
body("age").notEmpty().withMessage("age is required  ").custom((value) => {


    if (value <= 0 || value > 100) {
        throw new Error("age should be equal to 1 and less than 100")
    }

    return true;
}),
body("gender").notEmpty().withMessage("gender is required  ").isIn(["Male", "Female","Others"]).withMessage("write proper gender"),
 async (req, res) => {
     console.log(body("first_name"));
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         let newErrors = errors.array().map(({msg, param, location})=> {
           return {
               [param]:msg,
           };  
        });
         return res.status(400).json({
             errors: newErrors
         });
     }
    try {
        const users = await User.create(req.body);
       

        return res.status(201).send(users);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: "Failed"
        })
    }
})

//pagination page
router.get('', async (req, res) => {
    try {

        const page = +req.query.page || 1;
        const size = +req.query.size || 2;

        const skip = (page - 1) * size



        const users = await User.find().skip(skip).limit(size).lean().exec();

        const totalpages = Math.ceil(await User.find().countDocuments() / size)
        return res.json({
            users,
            totalpages
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 'Failed'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean().exec();

        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 'Failed'
        });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            .lean()
            .exec();

        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 'Failed'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(201).send(user);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 'Failed'
        });
    }
});

module.exports = router