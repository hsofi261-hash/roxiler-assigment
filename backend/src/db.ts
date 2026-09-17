import { Sequelize } from 'sequelize';

const dbName = process.env.MYSQL_DATABASE as string;
const dbUser = process.env.MYSQL_USER as string;
const dbPassword = process.env.MYSQL_PASSWORD as string;
const dbHost = process.env.MYSQL_HOST || 'localhost'; // Fallback to localhost
const dbPort = Number(process.env.MYSQL_PORT) || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost, // <--- Using the environment variable here
  port: dbPort,
  dialect: 'mysql',
  logging: false,
});

export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('database is connected')
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;