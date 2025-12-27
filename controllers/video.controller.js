const {Video} = require("../models/video.model");
const fs = require('fs')
const path = require('path')
const { processVideo } = require("../service/statustracking");


// uploadVideo API.

const uploadVideo = async (req, res) => {
  try {
   // step 1: check the video file exists or not
    if (!req.file) {
      return res.status(400).json({ message: "Video file required" });
    }
    
    // step 2: create the data model of video
    const video = await  Video.create({
      title:   req.body.title,
      filename: req.file.filename,
      status: "processing",
      uploadedBy: (req.user.userId),
      tenantId: req.user.tenantId
      
    });

     req.io.emit("videoAdded", video);

    // step 3: start the processing of the video
    processVideo(video._id,req.io);

    // step 4: send the success response
    res.status(201).json({
      message: "Video uploaded successfully",
      video
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};


// fetch the videos

const getVideos = async (req, res) => {
  try {
    let videos = []

    // step 1: get the safe videos
    if(req.user.role === 'viewer'){
      videos = await Video.find({status:"safe"}).sort({createdAt:-1})
    }

    // step 2: get the videos from db using tenantId(unique)
    else{
       videos = await Video.find({
        tenantId: req.user.tenantId
        }).sort({ createdAt: -1 });
       
        console.log(videos)
     }

    // step 3: return the videos
    res.status(200).json({message:"videos fetched sucessfully",videos:videos,success:true});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// streaming Video API

const streamVideo = async (req,res)=>{
    try {
        // step 1: get the data from the params and middleware
        const {videoId} = req.params
        const user = req.user

        // step 2: get the video metadata from db
        const video = await Video.findById(videoId)

        if(!video){
            return res.status(404).json({ message: 'Video not found' });
        }

        // step 3: check the tenantId isolation
        if(video.tenantId !== user.tenantId){
            return res.status(403).json({ message: 'Access denied' });
        }

        // step 4: only safe video can be streamed
        if(video.status !== "safe"){
             return res.status(403).json({ message: 'Video not ready for playback' });
        }

        // step 5: get the video path;
        const videopath = path.join(
            __dirname,
            '../uploads',
            video.filename
        )

        const videosize = fs.statSync(videopath).size;
        const range = req.headers.range;

        // step 6: range header is required.
        if(!range){
            return res.status(400).send('Range header required');
        }

        // step 7: parse the range and get the start and end.
        const CHUNK_SIZE = 1*1024*1024;
        const start = Number(range.replace(/\D/g,''));
        const end = Math.min(start+CHUNK_SIZE, videosize-1);

        // step 8: Headers.
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videosize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': 'video/mp4'
        };

        // step 9:  send content
        res.writeHead(206,headers);

        const videoStream = fs.createReadStream(videopath,{start,end});
        videoStream.pipe(res);

    } catch (error) {
       if(!res.headersSent){
         res.status(500).json({ message: 'Streaming error' });
       }
    }
}

module.exports = { uploadVideo,getVideos,streamVideo };
