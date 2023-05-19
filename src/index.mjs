import { log, readLog, access, warn, debug, system, database, event, info, error, fatal } from "./logger.mjs";
import { logtoDb } from "./db_client.mjs";



logtoDb({level:info, message:"send to mongo db", error, ipAddress:"192.168.1.10", browserDetails:"Chrome"})
log({ level: 'info', message: 'Hello' })

// const issue = new Error()
// issue.message = "There was new error"
// access('new access is given')

// error('issue')

// readLog('event.log').then(result => {
//     console.log(result)
// })