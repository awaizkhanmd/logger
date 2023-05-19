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

import * as readline from "node:readline/promises";
import config from "./config.mjs";
/**
 *main logging function
 * @param {objects} options
 * OBJECTS {level,message,error}
 *
 */
export const log = (options) => {
    const levelName = getLevelName(options.level);
    const message = options.message ?? "Unidentified";
    const error = options.error ?? null;

    //Logging everting console
    writeToConsole(levelName, message, error);

    if (config.levels[levelName].writeToFile) {
        writeToFile(levelName, message);
    }
};
/**
 *
 * @param {string} levelName
 * @param {string} message
 * @param {Error/null} error
 */
const writeToConsole = (levelName, message, error = null) => {
    const level = config.levels[levelName];
    let chalkFunction = null;
    if (level.color.includes("#")) {
        chalkFunction = chalk.hex(level.color);
    } else if (Array.isArray(level.color)) {
        if (level.color.length === 3) {
            chalkFunction = chalk.rgb(level.color[0], level.color[1], level.color[2]);
        } else {
            throw new Error(
                `We've detected that the configuration for the logger level ${chalk.red(
                    `[${levelName.toUpperCase()}]`
                )} is setfor RGB but only has ${chalk.red(
                    `${level.color.length}`
                )} values.\nThe Configuration must be an ${chalk.red("array")}
            and contain ${chalk.red("3")}values.`
            );
        }
    } else {
        chalkFunction = chalk[level.color];
    }
    message = error
        ? `${chalkFunction(`${error.message}\n ${error.stack}`)}`
        : message;
    const header = `[${levelName.toUpperCase()}]:[${getFormattedCurrentDate()}]`;
    console.log(`${chalkFunction(header)}:${chalkFunction(message)}`);
}
/**
 * Write the Formatted Message to file
 * @param {string} levelName
 * @param {string} message
 */
const writeToFile = (level, message) => {
    const logsDir = './logs'
    const data = `{"level":"${level.toUpperCase()}","message":"${message}","timestamo":"${getFormattedCurrentDate()}"}\r\n`;

    if (!existsSync(logsDir)) {
        mkdirSync(logsDir);
    } {
        const options = {
            encoding: 'utf8', mode: 438
        }
        appendFileSync(`./logs/${level}.log`, data, options)
    }
}
/**
 * Read data from log
 * @param {String} fileName 
 * @return  promise
 */
export const readLog = async (fileName = null) => {
    const logsDir = './logs'
    return new Promise((resolve, reject) => {
        const file = path.join(
            logsDir, fileName.includes('.') ? fileName : `${fileName}.log`

        )
        const lineReader = readline.createInterface({
            input: createReadStream(file)
        })
        const logs = []
        lineReader.on('line', (line) => {
            logs.push(JSON.parse(line))
        })
        lineReader.on('close', () => {
            console.log(
                chalk.yellow(`${fileName.toUpperCase()} logs has been accessed`)
            )
            console.table(logs)
            resolve(logs)
        })
        lineReader.on('error', (error) => {
            reject(error)
        })
    })
}
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
/**
 * Helper function For colosling log /or printing Acces level logs
 * @param {String*} message 
 */
export const access = (message) => {
    log({ level: 'access', message })
}
/**
 * Helper function For colosling log /or printing warn level logs
 * @param {String*} message 
 */
export const warn = (message) => {
    log({ level: 'warn', message })
}
/**
 * Helper function For colosling log /or printing Debug level logs
 * @param {String*} message 
 */
export const debug = (message) => {
    log({ level: 'debug', message })
}
/**
 * Helper function For colosling log /or printing system level logs
 * @param {String*} message 
 */
export const system=(message)=>{
    log({level:'system',message})
}/**
 * Helper function For colosling log /or printing database level logs
 * @param {String*} message 
 */
export const database=(message)=>{
    log({level:'database',message})
}
/**
 * Helper function For colosling log /or printing event level logs
 * @param {String*} message 
 */
export const event=(message)=>{
    log({level:'event',message})
}
/**
 * Helper function For colosling log /or printing info level logs
 * @param {String*} message 
 */
export const info=(message)=>{
    log({level:'info',message})
}
/**
 * Helper function For colosling log /or printing error level logs
 * @param {String,| error} message 
 */
export const error=(error)=>{
    if(typeof error==='string'){
        log({level:'error',message:error})
    }
    else{
        log({level:'error',error})
    }
   
}
/**
 * Helper function For colosling log /or printing fatal level logs
 * @param {String*} message 
 */
export const fatal=(error)=>{
    if( typeof error==='string'){
        log({level:'fatal',message:error})
    }
    else{
    log({level:'fatal',error})
}}
