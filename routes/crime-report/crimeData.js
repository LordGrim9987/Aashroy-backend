const CRIME_REPORTS = require("../../database/models/crime_reports");
// const HOMELESS = require("../../database/models/homeless"crim);
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
    const crime = await CRIME_REPORTS.find({
      date: {
        $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
      },
    });
    const crime_list = await CrimeLocationWiseSearchAsync(
      crime,
      geo_location.latitude,
      geo_location.longitude,
      diameter
    );
    let topImages = getRandomImagesFromCrimeList(crime_list);
    if (topImages.length == 0) {
      topImages = [
        { url: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png" },
      ];
    }

    const crimeMap = groupSimilarLocations(crime_list);

    res.status(200).json({ crime_list, topImages, crimeMap });
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
    const crimes = await CRIME_REPORTS.find({
      date: {
        $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
      },
    });
    const { latitude, longitude } = await getCoordsFromAddressAsync(address);
    if (latitude == -1) return res.sendStatus(404);

    let crime_list = await CrimeLocationWiseSearchAsync(
      crimes,
      latitude,
      longitude,
      diameter
    );
    const crimeMap = groupSimilarLocations(crime_list);

    let topImages = getTopImages(crime_list, address);
    let msg = "Crimes near " + address;
    if (topImages.length == 0) {
      topImages = [
        { url: "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png" },
      ];
    }
    shuffle(topImages);
    if (crime_list.length == 0) {
      msg = "No results found";
    }

    res.status(200).json({ crime_list, msg, topImages, crimeMap });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const MAX_DISTANCE = 10; //in km

const CrimeLocationWiseSearchAsync = async (
  crime_list,
  latitude,
  longitude,
  diameter
) => {
  const ERROR_FACTOR = 3;
  return new Promise((resolve, reject) => {
    if (diameter == -1) diameter = MAX_DISTANCE;

    let result = [];
    crime_list.forEach((h) => {
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
  let pattern = address;

  const crime = await CRIME_REPORTS.find({
    $or: [
      { "geo_location.address": address },
      { reverse_geocoding_address: { $regex: pattern, $options: "i" } },
    ],
  });
  let lats = 0,
    longs = 0;
  for (let i = 0; i < crime.length; i++) {
    lats += crime[i].geo_location.latitude;
    longs += crime[i].geo_location.longitude;
  }
  if (crime.length == 0) {
    return { latitude: -1, longitude: -1 };
  }
  lats /= crime.length;
  longs /= crime.length;
  return { latitude: lats, longitude: longs };
};

const groupSimilarLocations = (crime_list) => {
  let hMap = {};

  for (let i = 0; i < crime_list.length; i++) {
    if (crime_list[i].geo_location.address in hMap) {
      hMap[crime_list[i].geo_location.address].push(crime_list[i]);
    } else {
      hMap[crime_list[i].geo_location.address] = [crime_list[i]];
    }
  }
  return hMap;
};

const getTopImages = (crime_list, address) => {
  let result = [];
  for (let i = 0; i < crime_list.length; i++) {
    if (crime_list[i].geo_location.address == address) {
      for (let j = 0; j < crime_list[i].media_urls.length; j++) {
        result.push(crime_list[i].media_urls[j]);
      }
    }
  }
  return result;
};

const getRandomImagesFromCrimeList = (crime_list) => {
  let result = [];
  for (let i = 0; i < crime_list.length; i++) {
    for (let j = 0; j < crime_list[i].media_urls.length; j++) {
      result.push(crime_list[i].media_urls[j]);
    }
  }
  shuffle(result);
  return result;
};

module.exports = router;
