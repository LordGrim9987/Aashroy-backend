const router = require("express").Router();
const Donation = require("../../database/models/donation");

// route to bring latest donations
router.get("/", async (req, res) => {
  try {
    // retrieve data and send it back
    const data = await Donation.find()
      .sort({ createdAt: -1 })
      .populate({ path: "ngo", select: { name: 1 } })
      .limit(100)
      .select({ donorName: 1, type: 1, media_urls: 1 });

    res.status(200).json({ donations: data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
