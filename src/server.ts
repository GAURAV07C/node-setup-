import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rateLimiter';
import databaseService from './services/databaseService';
import logger from './utils/logger';
const server = app.listen(config.PORT)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  try{
    // data base connection
    const connection = await databaseService.connect()
        logger.info(`DATABASE_CONNECTION`, {
            meta: {
                CONNECTION_NAME: connection.name
            }
        })

        initRateLimiter(connection)
        logger.info(`RATE_LIMITER_INITIATED`)


    await databaseService.connect();


    logger.info(`APPLICATION_STARTED`, {
      meta: {
        PORT:config.PORT,
        SERVER_URL: config.SERVER_URL,
        // DATABASE_URL:config.DATABASE_URL
      }
    })

  } catch (err) {
    logger.error(`APPLICATION_ERROR`, { meta: err })

    server.close((error) => {
        if (error) {
              logger.error(`APPLICATION_ERROR`, { meta: error })
        }

        process.exit(1)
    })
}
})()
