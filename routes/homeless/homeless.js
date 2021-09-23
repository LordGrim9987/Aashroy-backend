const HOMELESS = require("../../database/models/homeless");
const HOMELESS_PERSON = require("../../database/models/homeless_person");
const Roles = require("../../database/roles");
const { shuffle } = require("../../utils/array");
const { authenticateToken } = require("../../utils/Authorize");
const { calculateDistance } = require("../../utils/location");

const router = require("express").Router();

router.post("/get/locationwise", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  const { geo_location, diameter, days } = req.body;
  try {
    const homeless = await HOMELESS.find({
      date: {
        $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
      },
    });
    const homeless_list = await HomeLessLocationWiseSearchAsync(
      homeless,
      geo_location.latitude,
      geo_location.longitude,
      diameter
    );
    let topImages = getRandomImagesFromHomelessList(homeless_list);
    if (topImages.length == 0) {
      topImages = [
        "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
      ];
    }

    const homelessMap = groupSimilarLocations(homeless_list);
    console.log(homelessMap);

    res.status(200).json({ homeless_list, topImages, homelessMap });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/get/addresswise", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  const { address, diameter, days } = req.body;
  try {
    const homeless = await HOMELESS.find({
      date: {
        $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
      },
    });
    const { latitude, longitude } = await getCoordsFromAddressAsync(address);
    if (latitude == -1) return res.sendStatus(404);

    let homeless_list = await HomeLessLocationWiseSearchAsync(
      homeless,
      latitude,
      longitude,
      diameter
    );

    const homelessMap = groupSimilarLocations(homeless_list);

    let topImages = getTopImages(homeless_list, address);
    let msg = "People near " + address;
    if (topImages.length == 0) {
      topImages = [
        "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
      ];
    }
    shuffle(topImages);
    if (homeless_list.length == 0) {
      msg = "No results found";
      console.log("nope");
    }
    res.status(200).json({ homeless_list, msg, topImages, homelessMap });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/get/personwise", authenticateToken, async (req, res) => {
  if (req.authData.role != Roles.NGO) {
    return res.sendStatus(403);
  }
  try {
    const { person, diameter } = req.body;
    const homeless_person = await HOMELESS_PERSON.find({
      person_name: person,
    }).populate("homeless", "geo_location");
    res.status(200).json({ homeless_person });
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
  const ERROR_FACTOR = 3;
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
      if (diameter - ERROR_FACTOR >= dist) {
        result.push(h);
      }
    });
    resolve(result);
  });
};

const getCoordsFromAddressAsync = async (address) => {
  /**
   * returns the latitude, longitude of estimated an address by searching it form database
   * Third Party Services like: Google maps api can be used directly in future
   */
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

const groupSimilarLocations = (homeless_list) => {
  let hMap = {};

  for (let i = 0; i < homeless_list.length; i++) {
    if (homeless_list[i].geo_location.address in hMap) {
      hMap[homeless_list[i].geo_location.address].push(homeless_list[i]);
    } else {
      hMap[homeless_list[i].geo_location.address] = [homeless_list[i]];
    }
  }
  return hMap;
};

const getTopImages = (homeless_list, address) => {
  let result = [];
  for (let i = 0; i < homeless_list.length; i++) {
    if (homeless_list[i].geo_location.address == address) {
      for (let j = 0; j < homeless_list[i].media_url.length; j++) {
        result.push(homeless_list[i].media_url[j]);
      }
    }
  }
  return result;
};

const getRandomImagesFromHomelessList = (homeless_list) => {
  let result = [];
  for (let i = 0; i < homeless_list.length; i++) {
    for (let j = 0; j < homeless_list[i].media_url.length; j++) {
      result.push(homeless_list[i].media_url[j]);
    }
  }
  shuffle(result);
  return result;
};

module.exports = router;
