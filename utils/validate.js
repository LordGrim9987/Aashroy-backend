function nullUndefCheck(vars) {
  for (const item of Object.entries(vars)) {
    if (!item) return false;
  }
  return true;
}

module.exports = {
  nullUndefCheck,
};
