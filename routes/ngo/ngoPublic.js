const NGO = require("../../database/models/ngo");
const { authenticateToken } = require("../../utils/Authorize");
const { calculateDistance } = require("../../utils/location");
const { nullUndefCheck } = require("../../utils/validate");

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

router.post("/nearest", async (req, res) => {
  const { diameter, geo_location } = req.body;
  if (!nullUndefCheck({ diameter: diameter, geo_location: geo_location })) {
    console.log(geo_location);
    return res.sendStatus(400);
  }
  try {
    const ngos = await NGO.find({});
    const nearest = await ngoLocationWiseSearchAsync(
      ngos,
      geo_location.latitude,
      geo_location.longitude,
      diameter
    );
    res.status(200).json({ ngos: nearest });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const MAX_DISTANCE = 10; //in km

const ngoLocationWiseSearchAsync = async (
  ngos,
  latitude,
  longitude,
  diameter
) => {
  return new Promise((resolve, reject) => {
    if (diameter == -1) diameter = MAX_DISTANCE;

    let result = [];
    ngos.forEach((n) => {
      const dist = calculateDistance(
        n.geo_location.latitude,
        n.geo_location.longitude,
        latitude,
        longitude
      );
      if (diameter >= dist) {
        result.push({
          _id: n._id,
          name: n.name,
          geo_location: n.geo_location,
          about: n.about,
          closeness: dist,
        });
      }
    });
    resolve(result);
  });
};
module.exports = router;

// const locations = {
//   machorhatnamghor: [26.7683064, 94.2070605],
//   kenduguripujamondir: [26.7626596, 94.2163114],
//   santiashrom: [26.7853525, 94.1930016],
//   shrishrielengi: [26.8099691, 94.2122013],
//   fakuwafowl: [26.8338841, 94.2054407],
//   rajoimosjid: [26.76683, 94.333569],
// };
