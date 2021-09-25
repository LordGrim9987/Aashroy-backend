const router = require("express").Router();
const Donation = require("../../database/models/donation");
const NGO = require("../../database/models/ngo");
const Auth = require("../../utils/Authorize");
const Roles = require("../../database/roles");
const { body, validationResult } = require("express-validator");
const { uploadImageAsync } = require("../../database/blobStore");

const UPLOAD_PATH_DONATION = "/donations";

// route to create new donations
router.post(
  "/",
  Auth.authenticateToken,
  body("donorName").isString(),
  body("contactNumber").isNumeric(),
  body("type").isString(),
  body("media").isArray(),
  body("ngoId").isString(),
  body("dimensions").isArray(),
  body("weight").isString(),
  async (req, res) => {
    const authData = req.authData;
    const { donorName, contactNumber, type, ngoId, media, dimensions, weight } =
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

      // store the donation details
      // first upload the images
      let media_urls = [];
      media_urls = media.map(async (item) => {
        let result = await uploadImageAsync({
          upload_path: UPLOAD_PATH_DONATION,
          file: item,
        });
        return result.url;
      });

      // then store the data with the images url in db
      Promise.all(media_urls).then(async (values) => {
        // fix values
        let newValues = values.map((value) => {
          return { url: value, media_type: "image" };
        });

        const newRecord = new Donation({
          donor: authData.user_id,
          donor_name: donorName,
          contact_number: contactNumber,
          ngo: ngoId,
          type: type,
          media_urls: newValues,
          dimensions: dimensions,
          weight: weight,
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

// route to get ngo details to show in donation site
router.get("/ngo-details/:ngoId", Auth.authenticateToken, async (req, res) => {
  const authData = req.authData;
  const ngoId = req.params.ngoId;

  try {
    // check user role before doing anything
    if (authData.role != Roles.GENERAL_USER)
      res
        .status(403)
        .json({ message: "You are not authorized to this endpoint." });

    // find the details and send back
    const ngoData = await NGO.find({ _id: ngoId }).select({
      name: 1,
      email: 1,
      phone: 1,
      geo_location: 1,
      website: 1,
    });
    res.status(200).send(ngoData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// routes to get ones donations
router.get(
  "/my-donations/:skip/:limit",
  Auth.authenticateToken,
  async (req, res) => {
    const skip = req.params.skip || 0;
    const limit = req.params.limit || 10;
    const authData = req.authData;
    try {
      // check user role before doing anything
      if (authData.role != Roles.GENERAL_USER)
        res
          .status(403)
          .json({ message: "You are not authorized to this endpoint." });

      // retrieve data
      const data = await Donation.find({ donor: authData.user_id })
        .populate({ path: "ngo", select: { name: 1 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ donations: data });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
