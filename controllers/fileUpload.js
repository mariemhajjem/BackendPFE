const fileUpload = require('express-fileupload'); 
// how to upload a file to nodejs express server?


app.post('/upload', fileUpload(), uploadFile)

export const uploadFile =  function(req, res) {  
  const sampleFile = req.files.uploadedFile;
  // do something with file
  res.send('File uploaded');
}
 