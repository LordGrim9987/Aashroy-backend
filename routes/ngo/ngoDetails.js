const { uploadImageAsync } = require("../../database/blobStore");
const NGO = require("../../database/models/ngo");
const Roles = require("../../database/roles");
const { authenticateToken } = require("../../utils/Authorize");
const { nullUndefCheck } = require("../../utils/validate");

const router = require("express").Router();

router.post("/updatebasic", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { name, email, phone, about, website } = req.body;
  if (!nullUndefCheck({ name, email, phone, about, website }))
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
router.post("/getdata", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { user_id } = req.authData;
  try {
    const ngo = await NGO.findById(
      { _id: user_id },
      {
        name: 1,
        email: 1,
        phone: 1,
        about: 1,
        website: 1,
        media_urls: 1,
        geo_location: 1,
        members: 1,
      }
    );
    if (!ngo) {
      return res.sendStatus(404);
    }
    // console.log(ngo, ">>>oi");
    return res.status(200).json({ ngo });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/addmember", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { user_id } = req.authData;
  const { name, role, profile_pic, about } = req.body;
  if (!nullUndefCheck({ name, role, profile_pic, about })) {
    return res.sendStatus(400);
  }
  try {
    const public_id = "thiispublicid.jpg";
    const { secure_url } = await uploadImageAsync({
      upload_path: "ngo/",
      file: profile_pic,
    });

    const ngo = await NGO.findById({ _id: user_id });
    if (!ngo) {
      return res.sendStatus(404);
    }
    ngo.members = ngo.members
      ? [...ngo.members, { name, role, profile_pic: secure_url, about }]
      : [{ name, role, profile_pic, about }];
    const newNgo = await ngo.save();
    return res.status(200).json({ members: newNgo.members });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/deletemember", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { user_id } = req.authData;
  const { _id } = req.body;
  if (!nullUndefCheck({ _id })) {
    return res.sendStatus(400);
  }
  try {
    const ngo = await NGO.findById({ _id: user_id });
    if (!ngo) {
      console.log(ngo);
      return res.sendStatus(404);
    }
    ngo.members = ngo.members.filter((m) => m._id != _id);
    const newNgo = await ngo.save();

    return res.status(200).json({ members: newNgo.members });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/addnewphoto", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) return res.sendStatus(403);
  const { user_id } = req.authData;
  const { image } = req.body;
  if (!nullUndefCheck({ image })) return res.sendStatus(400);

  try {
    const { secure_url } = await uploadImageAsync({
      upload_path: "ngo/",
      file: image,
    });
    const ngo = await NGO.findById({ _id: user_id });
    if (!ngo) return res.sendStatus(404);
    ngo.media_urls.push({ url: secure_url, media_type: "image" });
    const newNgo = await ngo.save();
    res.status(200).json({ newMediaList: newNgo.media_urls.reverse() });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
