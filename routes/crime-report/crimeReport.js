const router = require("express").Router();
const CrimeReport = require("../../database/models/crime_reports");
const Auth = require("../../utils/Authorize");
const Roles = require("../../database/roles");
const { body, validationResult } = require("express-validator");
const { uploadImageAsync } = require("../../database/blobStore");

const UPLOAD_PATH_CRIME_REPORT = "/crime-report";
const IMAGE_PUBLIC_ID_CRIME_REPORT = "crime-report";

// route to save crime report data to server
router.post(
  "/",
  body("type").isString(),
  body("typeDescription").isString(),
  body("geoLocation").isObject(),
  body("briefReport").isString(),
  body("media").isArray(),
  body("reverseGeocodingAddress").isString(),
  async (req, res) => {
    const {
      type,
      typeDescription,
      geoLocation,
      briefReport,
      media,
      reverseGeocodingAddress,
    } = req.body;
    try {
      // validate data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        msg = "";
        errors.array().map((item) => (msg += ` ${item.msg}->${item.param},`));
        throw Error(msg);
      }

      // upload the media files
      let media_urls = [];
      media_urls = media.map(async (item) => {
        let result = await uploadImageAsync({
          upload_path: UPLOAD_PATH_CRIME_REPORT,
          file: item,
          public_id: IMAGE_PUBLIC_ID_CRIME_REPORT,
        });
        return result.url;
      });

      // receive the media_urls and store them along with the data
      Promise.all(media_urls).then(async (values) => {
        // fix values
        let newValues = values.map((value) => {
          return { url: value, media_type: "image" };
        });

        const newRecord = new CrimeReport({
          type: type,
          type_description: typeDescription,
          geo_location: geoLocation,
          reverse_geocoding_address: reverseGeocodingAddress,
          brief_report: briefReport,
          media_urls: newValues,
        });

        const savedRecord = await newRecord.save();
        // return successful
        res.sendStatus(200);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
