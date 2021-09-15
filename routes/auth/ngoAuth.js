const NGO = require("../../database/models/ngo");
const { generateJWT, authenticateToken } = require("../../utils/Authorize");
const { nullUndefCheck } = require("../../utils/validate");

const router = require("express").Router();
const crypto = require("crypto");
const Roles = require("../../database/roles");
const SESSIONS = require("../../database/models/sessions");

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
      password,
      geo_location: location,
    });
    res.status(200).json({});
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const ngo = await NGO.findOne(
      { email, password },
      { name: 1, _id: 1, media_urls: 1 }
    );
    if (!ngo) {
      return res.sendStatus(404);
    }
    //create new refreshed token and access_token
    const access_token = await generateJWT({ user_id: ngo._id });
    const refresh_token = crypto.randomBytes(64).toString("hex");

    await SESSIONS.updateOne(
      { user_id: ngo._id },
      {
        user_id: ngo._id,
        refresh_token: refresh_token,
        role: Roles.NGO,
      },
      { upsert: true }
    );

    return res.status(200).json({ access_token, ngoData: ngo, refresh_token });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/signout", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  //delete the refresh token
  try {
    const { refresh_token } = req.body;
    await SESSIONS.deleteOne({ refresh_token });
    res.status(200).json({});
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
