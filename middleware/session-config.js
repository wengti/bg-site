// session-config.js
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { getTableConnection } from '../table/getTableConnection.js';
import 'dotenv/config'


// import pg from 'pg';

// const { Pool } = pg;


const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgSession({
    pool: getTableConnection(),
    tableName: 'user_sessions',
    createTableIfMissing: true, // Auto-create table
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
});