




const cloudinary = require("cloudinary").v2;


exports.imageUpload = async (req, res,next) => {
    try {
     let profileImage = req.files;
     console.log(profileImage)

    if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const result = await cloudinary.uploader.upload(
          imageFile.tempFilePath,
          {
            resource_type: "image",
            folder: "images",
          }
        ); 
  
         
        console.log(result.secure_url, result.public_id)
  
    const imageUploded = {
          url: result.secure_url,
          public_Id: result.public_id,
        };
      }
      req.image= this.imageUpload;
      next();
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  };