const fs = require("fs");

const moduleExports = (module.exports = {});

moduleExports.readJSON = directory => {
  return JSON.parse(fs.readFileSync(directory, "utf8"));
};
moduleExports.writeJSON = (filename, jsonData) => {
  return fs.writeFile(filename, JSON.stringify(jsonData, null, "  "), err => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};
