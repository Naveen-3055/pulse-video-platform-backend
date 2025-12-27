const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { roleCheck } = require('../middlewares/role.middleware');
const { uploadVideo, getVideos, streamVideo } = require('../controllers/video.controller');
const { upload } = require('../config/multer');

const videoRouter = express.Router();

// video upload API
videoRouter.post(
    '/upload',
    verifyToken,
    roleCheck,
    upload.single("video"),
    uploadVideo
)

// get videos API
videoRouter.get('/getallvideos',verifyToken,getVideos)

// streaming video API
videoRouter.get('/stream/:videoId',verifyToken,streamVideo);

module.exports = {videoRouter}