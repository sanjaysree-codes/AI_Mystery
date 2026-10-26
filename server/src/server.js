import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import app from './app.js';

try {
  await connectDatabase();
  app.listen(env.PORT, () => console.info(`AI Mystery Room API listening on port ${env.PORT}`));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
