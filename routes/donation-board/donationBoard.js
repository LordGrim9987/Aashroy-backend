const router = require("express").Router();
const Donation = require("../../database/models/donation");

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
      .sort({ createdAt: -1 })
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

module.exports = router;
