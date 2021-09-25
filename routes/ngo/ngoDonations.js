const router = require("express").Router();
const Donation = require("../../database/models/donation");
const NGO = require("../../database/models/ngo");
const Auth = require("../../utils/Authorize");
const Roles = require("../../database/roles");
const GeneralUser = require("../../database/models/general_user");

// routes to get ngo's donations
router.get(
  "/our-donation/:skip/:limit",
  Auth.authenticateToken,
  async (req, res) => {
    const skip = req.params.skip || 0;
    const limit = req.params.limit || 10;
    const authData = req.authData;
    try {
      // check user role before doing anything
      if (authData.role != Roles.NGO)
        res
          .status(403)
          .json({ message: "You are not authorized to this endpoint." });

      // retrieve data
      let data = await Donation.find({ ngo: authData.user_id })
        .populate({ path: "donor", select: { profile_pic: 1 } })
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit);

      // map and remove the anonymous data's profile_pic
      data = JSON.parse(JSON.stringify(data));
      data.map((item) => {
        if (item.donor_name === "Anonymous") {
          item.donor.profile_pic = "";
          item.donor._id = "";
        }
        return item;
      });

      res.status(200).json({ donations: data });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

// route to accept donation
router.patch("/accept-donation", Auth.authenticateToken, async (req, res) => {
  const authData = req.authData;
  const { donationId } = req.body;
  try {
    // check user role before doing anything
    if (authData.role != Roles.NGO)
      res
        .status(403)
        .json({ message: "You are not authorized to this endpoint." });

    // update the donation details
    const updateProfile = await Donation.updateOne(
      { _id: donationId, ngo: authData.user_id },
      {
        $set: {
          is_accepted_by_ngo: true,
        },
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// route to accept donation
router.patch("/received-donation", Auth.authenticateToken, async (req, res) => {
  const authData = req.authData;
  const { donationId } = req.body;
  try {
    // check user role before doing anything
    if (authData.role != Roles.NGO)
      res
        .status(403)
        .json({ message: "You are not authorized to this endpoint." });

    // update the donation details
    const updateProfile = await Donation.updateOne(
      { _id: donationId, ngo: authData.user_id },
      {
        $set: {
          is_donation_received: true,
        },
      }
    );

    // before that increase the contribution points
    let userId = await Donation.find({ _id: donationId });
    await GeneralUser.findOneAndUpdate(
      { _id: userId[0].donor },
      { $inc: { contribution_points: 20 } }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
