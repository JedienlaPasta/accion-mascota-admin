import postgres from 'postgres';

declare global {
  var sql: postgres.Sql | undefined;
}

const connectionString = process.env.DATABASE_URL;

const sql =
  globalThis.sql ||
  postgres(connectionString!, {
    max: 10, // Máximo de conexiones abiertas
    idle_timeout: 20, // Tiempo de inactividad en segundos
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.sql = sql;
}

export default sql;
