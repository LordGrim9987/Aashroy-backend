function nullUndefCheck(vars) {
  return true;
  for (const item of Object.keys(vars)) {
    if (!vars.item || vars.item == undefined) return false;
  }
  return true;
}

module.exports = {
  nullUndefCheck,
};
