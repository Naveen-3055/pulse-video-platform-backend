const multer = require('multer')
const path = require('path')
const fs = require('fs')

// step 1:check the upload folder is exists or not
const uploadDir = "uploads"
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
}

// step 2: files are stored 
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(req,file,cb)=>{

      cb(null, file.originalname);
  
    }
})

// step 3: filter the files 
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// step 4: upload video file.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB
  }
});

module.exports = {upload}