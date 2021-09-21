const radians = (degree) => {
  const PI = Math.PI;
  return degree * (PI / 180);
};
const calculateDistance = (lt1, lg1, lt2, lg2) => {
  let lon1 = radians(lg1);
  let lon2 = radians(lg2);
  let lat1 = radians(lt1);
  let lat2 = radians(lt2);

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;

  let a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  let c = 2 * Math.asin(Math.sqrt(a));
  // Radius of earth in kilometers.
  let r = 6371;

  return Math.ceil(c * r);
};

module.exports = { calculateDistance };
