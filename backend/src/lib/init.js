import { API_PATH, SWAGGER_PATH, env } from '@/lib/config';
import { mainLogger } from '@/lib/logger/winston';
import { connectDB } from '@/lib/mongo/db';
import { getServer } from '@/lib/server';
import { config } from 'dotenv';
import { initializeEmailTransporter } from '@/lib/utils/email';

config();

export const init = async () => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const db = await connectDB(env.DB_URL);

        if (db) {
          await initializeEmailTransporter();
          const app = getServer();

          app.listen(env.PORT, () => {
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}`);
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}${API_PATH}heartbeat`);
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}${API_PATH}${SWAGGER_PATH}`);
          });
          resolve("DB connected");
        } else {
          reject("DB connection failed");
        }
      } catch (e) {
        reject({ message: "Cannot connect the db", ...e });
        mainLogger.error({ message: "Cannot start the server" });
      }
    })();
  });
};


