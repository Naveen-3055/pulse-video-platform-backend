const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const generateToken = async (userId)=>{
    try {
        // step 1: create token
        const user = await User.findById(userId)
       
        let token = await jwt.sign(
            {userId:userId,role:user.role,tenantId:user.tenantId},
             process.env.JWT_SECRET_KEY,
              {expiresIn:"2d"})
        console.log(token);

        // step 2: return the token
        return token;
    } catch (error) {
        console.log("error at generating the token", error.message)
    }
}

module.exports = {generateToken}