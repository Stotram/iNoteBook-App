const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const bcrypt= require ('bcryptjs');
const jwt= require ('jsonwebtoken');
const fetchuser= require('../middleware/fetchuser');

const JWT_SECRET= 'aritra__paul'

router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    try {

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success, message: "A user with this email already exists" })
        }

        const salt= await bcrypt.genSalt(10)
        const secPass= await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        success=true;
        
        const data= {
            user: {
                id: user.id
            }
        }

        const authToken= jwt.sign(data, JWT_SECRET);
        res.json({success, authToken})

    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").notEmpty()
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    let success=false;

    try {
        let user = await User.findOne({email})
        if (! user) {
            return res.status(400).json({success, message: "Please try to login with correct credentials"})
        }

        const pCompare= await bcrypt.compare (password, user.password);
        if (!pCompare){
            return res.status(400).json({success, message: "Please try to login with correct credentials"});
        }
        
        success=true;
        const data= {
            user: {
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        res.json({success, authToken})

    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

router.post('/getuser', fetchuser, async (req, res)=>{

    try {
        const userID= req.user.id;
        const user= await User.findById(userID).select("-password");
        res.json({user})
    }
    catch (err) {
        res.status(500).send("Internal error occurred")
    }
})

module.exports = router;