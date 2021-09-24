const router = require("express").Router();
const Homeless = require("../../database/models/homeless");
const HomelessPerson = require("../../database/models/homeless_person");
const GeneralUser = require("../../database/models/general_user");
const Auth = require("../../utils/Authorize");
const Roles = require("../../database/roles");
const { body, validationResult } = require("express-validator");
const { uploadImageAsync } = require("../../database/blobStore");

const UPLOAD_PATH = "/homeless-report";
const UPLOAD_PATH_ADD_INFO = "/homeless-report-add-info";
const IMAGE_PUBLIC_ID = "homeless";
const IMAGE_PUBLIC_ID_ADD_INFO = "homeless-person";

// route to report homeless people
// example request at reportHomeless.rest
router.post(
  "/",
  Auth.authenticateToken,
  body("numberOfPeople").isNumeric(),
  body("geoLocation").isObject(),
  body("media").isArray(),
  body("reverseGeocodingAddress").isString(),
  async (req, res) => {
    const authData = req.authData;
    const { numberOfPeople, geoLocation, media, reverseGeocodingAddress } =
      req.body;

    try {
      // check user role before doing anything
      if (authData.role != Roles.GENERAL_USER)
        res
          .status(403)
          .json({ message: "You are not authorized to this endpoint." });

      // validate data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        msg = "";
        errors.array().map((item) => (msg += ` ${item.msg}->${item.param},`));
        throw Error(msg);
      }

      // store data at database and send the ref back in response
      // upload images to cloudinary and get back the urls
      let media_urls = [];
      media_urls = media.map(async (item) => {
        let result = await uploadImageAsync({
          upload_path: UPLOAD_PATH,
          file: item,
          public_id: IMAGE_PUBLIC_ID,
        });
        return result.url;
      });

      // store the urls and the rest of the data to the db
      Promise.all(media_urls).then(async (values) => {
        // fix values
        let newValues = values.map((value) => {
          return { url: value, media_type: "image" };
        });
        const newRecord = new Homeless({
          number_of_people: numberOfPeople,
          geo_location: geoLocation,
          reverse_geocoding_address: reverseGeocodingAddress,
          reported_by: authData.user_id,
          media_url: newValues,
        });

        const savedRecord = await newRecord.save();

        // before that increase the contribution points
        await GeneralUser.findOneAndUpdate(
          { _id: authData.user_id },
          { $inc: { contribution_points: 5 } }
        );

        // and return the generated _id in response
        res.status(200).json({ recordId: savedRecord._id });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

// route to add additional information about a homeless report
// ex at reportHomeless.rest
router.post(
  "/additional-info",
  Auth.authenticateToken,
  body("data").isArray(),
  body("parentId").isString(),
  async (req, res) => {
    const authData = req.authData;
    const { data, parentId } = req.body;
    try {
      // check user role before doing anything
      if (authData.role != Roles.GENERAL_USER)
        res
          .status(403)
          .json({ message: "You are not authorized to this endpoint." });

      // validate data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        msg = "";
        errors.array().map((item) => (msg += ` ${item.msg}->${item.param},`));
        throw Error(msg);
      }

      // store each person in db
      // for each person
      // // store photo first - returns url
      let media_urls = [];
      media_urls = data.map(async (person) => {
        if (person.photo.length != 0 && person.photo[0].length != 0) {
          let result = await uploadImageAsync({
            upload_path: UPLOAD_PATH_ADD_INFO,
            file: person.photo[0],
            public_id: IMAGE_PUBLIC_ID_ADD_INFO,
          });
          return result.url;
        } else {
          return "";
        }
      });

      Promise.all(media_urls).then(async (values) => {
        // fix values
        let newValues = values.map((value) => {
          return { url: value, media_type: "image" };
        });

        // prepare the data
        let newData = [];
        data.map((person, index) => {
          newData.push({
            person_name: person.name,
            age_group: person.ageGroup,
            gender: person.gender,
            media_url: newValues[index],
            homeless: parentId,
          });
        });
        // store the data along with photo url and parent id
        let savedResults = await HomelessPerson.insertMany(newData);

        // before that increase the contribution points
        await GeneralUser.findOneAndUpdate(
          { _id: authData.user_id },
          { $inc: { contribution_points: 10 } }
        );

        res.sendStatus(200);
      });

      // return successful
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
