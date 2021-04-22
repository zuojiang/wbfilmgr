#!/usr/bin/env node

process.env.NODE_ENV = "production";
const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const run = require("../out/server/index.js").default;
const checkForUpdate = require("../out/server/checkForUpdate.js").default;

const {
  _: [rootDir],
  notCheckUpdate,
  userList,
  ...options
} = yargs
  .options({
    "http-port": {
      alias: "p",
      describe: "HTTP port",
      type: "number"
    },
    title: {
      alias: "t",
      describe: "Document's title"
    },
    "user-list": {
      alias: "u",
      describe: "The JSON file contains a list of user"
    },
    "not-check-update": {
      describe: "Don't check latest version",
      type: "boolean"
    },
    "gm-support": {
      describe: "GraphicsMagick or ImageMagick support",
      type: "boolean"
    }
  })
  .strict(true).argv;

const users = userList ? require(path.resolve(userList)) : null;

run({
  ...options,
  users,
  rootDir
}).then(app => {
  if (!notCheckUpdate) {
    checkForUpdate();
  }
});
