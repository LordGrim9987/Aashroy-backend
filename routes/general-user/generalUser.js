const router = require("express").Router();
const GeneralUser = require("../../database/models/general_user");
const Auth = require("../../utils/Authorize");
const Roles = require("../../database/roles");
const { body, validationResult } = require("express-validator");

// route to provide data for general user profile
router.get("/profile-details", Auth.authenticateToken, async (req, res) => {
  const authData = req.authData;
  try {
    // check user role before doing anything
    if (authData.role != Roles.GENERAL_USER)
      throw Error("You are not authorized to this endpoint.");

    // fetch the users profile details
    const profileData = await GeneralUser.find({
      _id: authData.user_id,
    }).select({ _id: 0 });

    // send back the response
    res.status(200).send(profileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// route to update data for general user profile
router.patch(
  "/profile-details",
  body("name").isString(),
  Auth.authenticateToken,
  async (req, res) => {
    const authData = req.authData;
    const { name } = req.body;
    try {
      // check user role before doing anything
      if (authData.role != Roles.GENERAL_USER)
        throw Error("You are not authorized to this endpoint.");

      // validate data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        msg = "";
        errors.array().map((item) => (msg += ` ${item.msg}->${item.param},`));
        throw Error(msg);
      }

      // update the users profile details
      const updateProfile = await GeneralUser.updateOne(
        { _id: authData.user_id },
        {
          $set: {
            name: name,
          },
        }
      );

      // send back the response
      res.sendStatus(200);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
