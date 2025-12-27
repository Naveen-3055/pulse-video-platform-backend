const express = require('express');
const { register, login, getUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const authRouter = express.Router();

// register API
authRouter.post('/register',register)

// login API
authRouter.post('/login',login)

// getUser

authRouter.get('/me',verifyToken,getUser)

module.exports = {authRouter}