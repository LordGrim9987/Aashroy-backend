const NGO = require("../../database/models/ngo");
const { nullUndefCheck } = require("../../utils/validate");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  const { name, email, phone, about, location, password } = req.body;
  if (!nullUndefCheck({ name, email, phone, about, location })) {
    return res.sendStatus(403);
  }
  try {
    const ngo = await NGO.create({
      name,
      email,
      phone,
      about,
      geo_location: location,
    });
    res.status(200).json({});
  } catch (error) {}
});

module.exports = router;
