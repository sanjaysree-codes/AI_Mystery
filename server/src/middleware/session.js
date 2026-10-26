import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from '../config/env.js';

export const sessionMiddleware = session({
  name: 'mystery.sid', secret: env.SESSION_SECRET, resave: false, saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: env.MONGODB_URI, collectionName: 'sessions', ttl: 60 * 60 * 24 * 30 }),
  cookie: { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 }
});

export function requireSession(req, res, next) {
  if (!req.sessionID) return res.status(401).json({ success: false, error: { code: 'SESSION_REQUIRED', message: 'Start a new session and try again.' } });
  req.ownerSessionId = req.sessionID;
  next();
}
