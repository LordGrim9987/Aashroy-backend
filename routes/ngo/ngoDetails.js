const NGO = require("../../database/models/ngo");
const Roles = require("../../database/roles");
const { authenticateToken } = require("../../utils/Authorize");

const router = require("express").Router();

router.post("/details/updatebasic", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { name, email, phone, about, website } = req.body;
  if (!validate({ name, email, phone, about, website }))
    return res.sendStatus(400);
  const { user_id } = req.authData;
  try {
    const updatedNgo = await NGO.findOneAndUpdate(
      { _id: user_id },
      { $set: { name, email, phone, about, website } },
      { upsert: false }
    );
    return res.status(200).json({ name, email, phone, about, website });
  } catch (error) {
    res.sendStatus(500);
  }
});
