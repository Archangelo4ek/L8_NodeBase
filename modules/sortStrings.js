function sortStrings(arr) {
  return arr.sort((a, b) =>
    a.replace(/\s+/g, "").localeCompare(b.replace(/\s+/g, ""))
  );
}

module.exports = { sortStrings };
