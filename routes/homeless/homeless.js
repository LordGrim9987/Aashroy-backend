const HOMELESS = require("../../database/models/homeless");
const Roles = require("../../database/roles");
const { authenticateToken } = require("../../utils/Authorize");
const { calculateDistance } = require("../../utils/location");

const router = require("express").Router();

router.post("/get/locationwise", authenticateToken, async (req, res) => {
  console.log("yoooo");
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  const { geo_location, diameter } = req.body;
  try {
    const homeless = await HOMELESS.find({});
    const homeless_list = await HomeLessLocationWiseSearchAsync(
      homeless,
      geo_location.latitude,
      geo_location.longitude,
      diameter
    );
    console.log(homeless_list);
    res.status(200).json({ homeless_list });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/get/addresswise", authenticateToken, async (req, res) => {
  console.log("yoooo");
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  const { address, diameter } = req.body;
  try {
    const homeless = await HOMELESS.find({});
    const { latitude, longitude } = await getCoordsFromAddressAsync(address);
    if (latitude == -1) return res.sendStatus(404);
    const homeless_list = await HomeLessLocationWiseSearchAsync(
      homeless,
      latitude,
      longitude,
      diameter
    );
    res.status(200).json({ homeless_list });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const MAX_DISTANCE = 10; //in km

const HomeLessLocationWiseSearchAsync = async (
  homeless_list,
  latitude,
  longitude,
  diameter
) => {
  return new Promise((resolve, reject) => {
    if (diameter == -1) diameter = MAX_DISTANCE;

    let result = [];
    homeless_list.forEach((h) => {
      const dist = calculateDistance(
        h.geo_location.latitude,
        h.geo_location.longitude,
        latitude,
        longitude
      );
      if (diameter >= dist) {
        result.push(h);
      }
    });
    resolve(result);
  });
};

const getCoordsFromAddressAsync = async (address) => {
  const homeless = await HOMELESS.find({
    "geo_location.address": address,
  });
  let lats = 0,
    longs = 0;
  for (let i = 0; i < homeless.length; i++) {
    lats += homeless[i].geo_location.latitude;
    longs += homeless[i].geo_location.longitude;
  }
  if (homeless.length == 0) {
    return { latitude: -1, longitude: -1 };
  }
  lats /= homeless.length;
  longs /= homeless.length;
  return { latitude: lats, longitude: longs };
};

module.exports = router;
