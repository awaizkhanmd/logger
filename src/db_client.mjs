import config from "./config.mjs";
import path from "path";
import chalk from "chalk";
import moment from "moment/moment.js";

import {
  existsSync,
  mkdir,
  appendFileSync,
  createReadStream,
  mkdirSync,
} from "fs";
/**
 * Main logging function
 * @param {object} options - Logging options {level, message, error, ipAddress, browserDetails}
 */
export const logtoDb = async (options) => {
  const levelName = getLevelName(options.level);
  const message = options.message ?? "Unidentified";
  const error = options.error ?? null;
  const ipAddress = options.ipAddress ?? null;
  const browserDetails = options.browserDetails ?? null;

  // Logging everything to the console
  writeToConsole(levelName, message, error, ipAddress, browserDetails);

  if (config.levels[levelName].writeToMongoDB) {
    await writeToMongoDB(levelName, message, error, ipAddress, browserDetails);
  }
};

/**
 * Write the formatted message to console
 * @param {string} levelName - Log level name
 * @param {string} message - Log message
 * @param {Error/null} error - Error object (optional)
 * @param {string/null} ipAddress - IP address (optional)
 * @param {string/null} browserDetails - Browser details (optional)
 */
const writeToConsole = (levelName, message, error = null, ipAddress = null, browserDetails = null) => {
  const level = config.levels[levelName];
  let chalkFunction = null;
  if (level.color.includes("#")) {
    chalkFunction = chalk.hex(level.color);
  } else if (Array.isArray(level.color)) {
    if (level.color.length === 3) {
      chalkFunction = chalk.rgb(level.color[0], level.color[1], level.color[2]);
    } else {
      throw new Error(`We've detected that the configuration for the logger level ${chalk.red(
        `[${levelName.toUpperCase()}]`
      )} is set for RGB but only has ${chalk.red(
        `${level.color.length}`
      )} values.\nThe Configuration must be an ${chalk.red("array")}
            and contain ${chalk.red("3")} values.`);
    }
  } else {
    chalkFunction = chalk[level.color];
  }
  message = error ? `${chalkFunction(`${error.message}\n ${error.stack}`)}` : message;
  const header = `[${levelName.toUpperCase()}]:[${getFormattedCurrentDate()}]`;
  const logMessage = `${chalkFunction(header)}:${chalkFunction(message)}`;

  if (ipAddress) {
    console.log(`IP Address: ${ipAddress}`);
  }
  if (browserDetails) {
    console.log(`Browser Details: ${browserDetails}`);
  }
  console.log(logMessage);
};

/**
 * Write the log message to MongoDB
 * @param {string} levelName - Log level name
 * @param {string} message - Log message
 * @param {Error/null} error - Error object (optional)
 * @param {string/null} ipAddress - IP address (optional)
 * @param {string/null} browserDetails - Browser details (optional)
 */
const writeToMongoDB = async (levelName, message, error = null, ipAddress = null, browserDetails = null) => {
  try {
    const client = await MongoClient.connect(mongoConfig.uri);
    const db = client.db(mongoConfig.dbName);
    const collection = db.collection(mongoConfig.collectionName);

    const logData = {
      level: levelName.toUpperCase(),
      message: message,
      timestamp: getFormattedCurrentDate(),
      ipAddress: ipAddress,
      browserDetails: browserDetails,
    };

    await collection.insertOne(logData);

    client.close();
  } catch (error) {
    console.error("Error writing to MongoDB:", error);
  }
};




/**
* get the level name
* @param {string} level 
* @returns 
*/
const getLevelName = (level) => {
  return level && config.levels.hasOwnProperty(level) ? level : "info";
};

/**
 * get the formmated date 
 * @returns String 
 */
const getFormattedCurrentDate = () => {
  return moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
};
