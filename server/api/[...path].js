import app from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

let databaseConnection;

export default async function handler(req, res) {
  databaseConnection ??= connectDatabase().catch((error) => {
    databaseConnection = undefined;
    throw error;
  });
  await databaseConnection;
  return app(req, res);
}
