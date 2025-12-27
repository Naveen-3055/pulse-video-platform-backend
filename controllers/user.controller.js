// buisiness logic.
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models/user.model");
const { generateToken } = require('../config/generatetoken');

const register = async (req,res)=>{
    try {
        // step 1: get the data from the body;
        const {email,password,role} = req.body;
        const tenantId = uuidv4()

        // step 2: check the email is already exists.
        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({message:"user already exists..."})
        }

        // step 3: validate the email
         if(!validator.isEmail(email)){
             return res.status(400).json({message:`Enter valid email`})
        }

        // step 4: check wheather password is strong or not.
        if(password.length <8){
            return res.status(400).json({message:`Enter strong password`})
        }


        // step 5: hash the password for security purpose
        const hashedPassword = await bcrypt.hash(password,10)

        // step 6: create a user model;
        const user = await User.create({
            email:email,
            password:hashedPassword,
            role:role,
            tenantId:tenantId
        })


        // step 7: return the user
        return res.status(201).json({message:"new user created", newUser: user, success:true})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"error in creating the user", success: false})
    }
}

const login = async (req,res)=>{
    try {
        // step 1: get the data from the body
        let {email,password} = req.body

        // step 2: find the user in db
        let user = await User.findOne({email})

        // step 3: if user not present , throw message response.
        if(!user){
             return res.status(400).json({message:`user not found`})
        }

        // step 4: compare the password using bcrypt.
        let isMatch = await bcrypt.compare(password, user.password)
        
        // step 5: check the  password is match or not
        if(!isMatch){
             return res.status(400).json({message:`incorrect password`})
        }

        // step 6: generate the token.
        let token = await generateToken(user._id)

        // step 7: store the token in cookies
        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            sameSite : "Strict",
            maxAge: 7*24*60*60*1000
        })
            user.token = token;
            console.log(user)
        // returnt the user 
        res.status(200).json({message:"login successfull", User: user, success:true})
    } catch (error) {
        res.status(500).json({message:`login error ${error}`})
    }
}

const getUser = async (req,res)=>{
    try {
        // step 1: get the userId from the middleware
        const userId = req.user.userId;

        // step 2: find the user
        const user = await User.findById(userId);

        // step 3: validation
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        // step 4: send the response
        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({message:"internal server error."})
    }
}
module.exports = {register,login,getUser}