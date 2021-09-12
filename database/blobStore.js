var cloudinary = require("cloudinary");

const config = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
  });
};

const uploadImageAsync = async ({ upload_path, file, public_id }) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      { folder: upload_path || "/", public_id, resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

/***
 *  uploads any BLOB file (image, video, txtfiles etc)
 * file must be multer file object
 * example:
 * 
        const multer  = require('multer')
        const upload = multer({})
        const { uploadFileAsync } = require('./database/blobStore')
        router.post("/upload", upload.single('file'), async (req, res) =>{

            const result = await uploadFileAsync({file: req.file})

            return res.status(200).json(result)
        })
 */
const uploadFileAsync = async ({ file }) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ resource_type: "auto" }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
      .end(file.buffer);
  });
};

module.exports = { config, uploadImageAsync, uploadFileAsync };
