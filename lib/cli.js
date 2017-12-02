const fs = require("fs");
const path = require("path");

const Sedusa = require("./sedusa");

const configFile = fs.readFileSync(path.resolve(path.normalize("/Users/kester/.sedusa.json")), "utf-8");
const config = JSON.parse(configFile);

new Sedusa(config);
