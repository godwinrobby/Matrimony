import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Simple forward-only migration runner.
 * Usage: npx tsx server/db/migrate.ts
 */
async function migrate() {
  const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var ${key} — check .env`);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    multipleStatements: true,
  });

  await conn.query(`CREATE TABLE IF NOT EXISTS migrations (
    name VARCHAR(190) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);

  const [appliedRows] = await conn.query<mysql.RowDataPacket[]>(
    'SELECT name FROM migrations'
  );
  const applied = new Set(appliedRows.map((r) => r.name as string));

  const dir = path.join(process.cwd(), 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`= skip ${file} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    process.stdout.write(`> applying ${file} ... `);
    await conn.query(sql);
    await conn.query('INSERT INTO migrations (name) VALUES (?)', [file]);
    console.log('done');
    ran++;
  }

  console.log(ran === 0 ? 'Database is up to date.' : `Applied ${ran} migration(s).`);

  // Seed a default admin account if none exists yet.
  const [admins] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM users WHERE role = 'admin'"
  );
  if ((admins[0] as { n: number }).n === 0) {
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash(
      process.env.SEED_ADMIN_PASSWORD || 'admin123',
      12
    );
    await conn.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
      [process.env.SEED_ADMIN_NAME || 'Administrator', process.env.SEED_ADMIN_EMAIL || 'admin@matrimony.local', hash]
    );
    console.log(`Seeded default admin (${process.env.SEED_ADMIN_EMAIL || 'admin@matrimony.local'}).`);
  } else {
    console.log('Admin user exists — skipping seed.');
  }

  await conn.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
