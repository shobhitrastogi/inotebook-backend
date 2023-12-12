const express = require("express");
const router = express.Router();
const User = require("../models/User");
var bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
 const JWT_SECRET='shyamjiisagoodboy'

// Route 1: Create a user using : Post "/api/auth/createuser" . No login required
router.post("/createuser", [
    body('name','Enter a valid name').isLength({min :3}),
    body("email",'Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({min:5})
],async(req, res) => {
    let success = false;
    // if there are error , return bad request and the errors 
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success , errors : errors.array()})
    }
    // Check whether the user with the same email is exist already 
    try {
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success , error:"Sorry a user with this email already exists"})
        }
        // Creating salt password ...
        const salt =await bcrypt.genSalt(10)
        const secpass= await bcrypt.hash(req.body.password,salt)
        user = await User.create({
            name:req.body.name,
            password :secpass,
            email : req.body.email
        })
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        success = true
        res.json({success , authtoken})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Some error occured")
    }
});

//Route 2:  Authenticate a user using : Post "/api/auth/login" . No login required
router.post("/login", [
    body("email",'Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({min:5})
],async(req, res) => {
    let success= false;
    // if there are error , return bad request and the errors 
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
  }
   const {email,password} = req.body;
   try {
    let user =await User.findOne({email})
    if(!user){
        success=false;
        return res.status(400).json({error:'Please try to login with the correct credentials'})
    }

    const passwordCompare =await bcrypt.compare(password,user.password)
    if(!passwordCompare){
        success = false;
         return res.status(400).json({success ,error:'Please try to login with the correct credentials'})
     }
     const data={
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

   } catch (error) {
    console.log(error.message)
    res.status(500).send("Some error occured")
   }


})

//Route 3:  Get loggedin  user using : Post "/api/auth/getuser" .  login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occurred");
    }
});
module.exports = router;