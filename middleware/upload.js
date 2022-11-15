const multer = require('multer');


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file in upload storage: ", file);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    console.log("file in upload storage: ", file);
    cb(null, new Date().toISOString().replace(/:/g, '-')+"-"+ file?.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  console.log("file in upload storage: ", file);
  if (
    file?.mimetype === 'image/png' ||
    file?.mimetype === 'image/jpg' ||
    file?.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; 

const upload = multer({
  storage: fileStorage,
  fileFilter
});

module.exports = upload