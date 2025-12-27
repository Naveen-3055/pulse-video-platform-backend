// connecting to database

const mongoose = require('mongoose')

const connectDb = async ()=>{
    try {
        // step 1: create connection
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected")
    } catch (error) {
        console.log("error",error)
    }
}

module.exports = {connectDb}