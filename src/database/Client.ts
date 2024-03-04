import { Pool, PoolClient, Client, ClientConfig, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const pool = new Pool({
    connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    ssl: {
        rejectUnauthorized: false
    }
})

const connectClient = async (): Promise<PoolClient> => {
    const client = await pool.connect();
    return client;
};

// const createClient = async (): Promise<Client> => {
//     console.log('Setting up database connection...');
//     const clientConfig: ClientConfig = {
//         connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
//         // UNSECURE! Not for production environment
//         ssl: {
//             rejectUnauthorized: false
//         }
//     };
//     const client: Client = new Client(clientConfig);
//     return client;
// };

// const connectClient = async (client: Client, clientConfig: ClientConfig): Promise<void> => {
//     try {
//         await client.connect();
//         console.log('Database connection successful to ' + clientConfig.host + ':' + clientConfig.port);
//     } catch (error) {
//         console.log('Database connection error:', error);
//         throw error;
//     }
// };

export default connectClient;