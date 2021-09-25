const router = require("express").Router();
const Donation = require("../../database/models/donation");
const GeneralUser = require("../../database/models/general_user");

// route to bring latest donations
router.get("/:skip/:limit", async (req, res) => {
  let skip = req.params.skip;
  let limit = req.params.limit;

  try {
    // retrieve data and send it back
    const data = await Donation.find({
      donor_name: { $ne: "Anonymous" },
      is_donation_received: true,
    })
      .sort({ updatedAt: "desc" })
      .select({ donor_name: 1, type: 1, media_urls: 1 })
      .populate({ path: "ngo", select: { name: 1 } })
      .populate({
        path: "donor",
        select: { profile_pic: 1 },
      })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ donations: data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// route to bring top 10 contributors
router.get("/top-contributors", async (req, res) => {
  try {
    // retrieve data and send it back
    const data = await GeneralUser.find()
      .sort({
        contribution_points: "desc",
      })
      .select({ email: 0, updatedAt: 0 })
      .limit(10);

    res.status(200).json({ donations: data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
