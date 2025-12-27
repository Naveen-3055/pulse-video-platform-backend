
const { Video } = require("../models/video.model");


const processVideo = async (videoId, io) => {
  try {
    // step 1: percentage of progress
    const steps = [10, 30, 50, 70, 100];

    for (let progress of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // step 2: Emit progress
      io.emit("videoProgress", { videoId, progress }); 
    }

    // step 3: After 100% progress, set final status
    const score = Math.floor(Math.random() * 100);
    const status = score > 70 ? "flagged" : "safe";

    // step 4: update the status in DB.
    await Video.findByIdAndUpdate(videoId, { status }); 
    
    // step 4: emit the status .
    io.emit("videoStatus", { videoId, status });   
        
  } catch (error) {
    console.log(error.message, "processing Video");
  }
};

module.exports = {processVideo}