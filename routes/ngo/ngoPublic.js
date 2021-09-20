const NGO = require("../../database/models/ngo");

const router = require("express").Router();

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const ngo = await NGO.findById({ _id: id });
    if (!ngo) {
      return res.sendStatus(404);
    }
    res.status(200).json({ ngo });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//@testing
router.get("/all", async (req, res) => {
  const ngos = await NGO.find({});
  res.status(200).json({ ngos });
});

module.exports = router;
