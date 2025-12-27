// this middleware checks the role of the user and provide the access

const { User } = require("../models/user.model")

// 1. if the user role is viewer -> user cannot upload
// 2. if the user role is editor or admin -> user can upload.

const roleCheck = async (req,res,next)=>{
    try {
        // step 1: only this roles are allowed to upload
        const allowedRoles = ["editor","admin"]


        // step 2: check the user role 
        if(!allowedRoles.includes(req.user.role)){
            console.log(req.user.role)
            return res.status(403).json({message: "Access denied"});
        }
        // step 3: go to next.
        next();

    } catch (error) {
        return res.status(500).json({message:"error in role middleware" ,succes:false})
    }
}

module.exports = {roleCheck}