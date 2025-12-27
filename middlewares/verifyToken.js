const jwt = require('jsonwebtoken')
const { User } = require('../models/user.model')

const verifyToken = async (req,res,next)=>{
    try {
        // step 1: get the token from the cookies.
        let token = req.cookies?.token

        // step 2: check the token is present or not
        if(!token){
            return res.status(400).json({message:"token not found"})
        }

        // step 3: verify the token with present token in cookies
        let verify = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        // step 4: check the token is verified or not
        if(!verify){
            return res.status(400).json({message:"token is not verified"})
        }

        const user = await User.findById(verify.userId);
        // step 5: if token is verified create a object 
        req.user = {
            userId: verify.userId,
            role: user.role,
            tenantId: user.tenantId
        };
        console.log(req.user)

        next()
    } catch (error) {
        console.log("isAuth error", error.message)
        return res.status(500).json({message:`isAuth error ${error}`})
    }
}

module.exports = {verifyToken}