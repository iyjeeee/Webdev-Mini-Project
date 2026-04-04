import pg from 'pg';

const { Pool } = pg;

let _pool = null; // lazily created singleton pool

// getPool() — returns the shared pool, creating it on first call
// By the time any route handler calls this, dotenv has already run.
const getPool = () => {
  if (_pool) return _pool; // return existing pool if already created

  // All env vars are available now because dotenv ran before any query
  _pool = new Pool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME     || 'miniproject',
    user:     process.env.DB_USER     || 'postgres',
    // String() cast + ?? guard: prevents undefined/null from reaching pg
    // pg SCRAM-SHA-256 auth requires password to be a string, never undefined
    password: String(process.env.DB_PASSWORD ?? ''),
    max:                    10,    // max concurrent connections
    idleTimeoutMillis:   30000,    // close idle connections after 30 s
    connectionTimeoutMillis: 2000, // fail fast if DB is unreachable
  });

  // Surface pool-level errors during development
  _pool.on('error', (err) => {
    console.error('[DB] Unexpected pool error:', err.message);
  });

  console.log('[DB] Pool created — host:', process.env.DB_HOST || 'localhost',
    '| db:', process.env.DB_NAME || 'miniproject',
    '| user:', process.env.DB_USER || 'postgres');

  return _pool;
};

// Proxy object — transparently forwards .query() and .connect() to the
// lazy pool so all existing `pool.query(...)` calls in controllers work
// without any changes.
const pool = {
  query:   (...args) => getPool().query(...args),
  connect: (...args) => getPool().connect(...args),
  end:     (...args) => getPool().end(...args),
};

export default pool;
