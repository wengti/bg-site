// session-config.js
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
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