// import { Pool, PoolClient } from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const DB_HOST = process.env.DB_HOST;
// const DB_PORT = process.env.DB_PORT;
// const DB_NAME = process.env.DB_NAME;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;

// const pool = new Pool({
//     connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
//     ssl: {
//         rejectUnauthorized: false
//     }
// })

// const connectClient = async (): Promise<PoolClient> => {
//     console.log('Attempting to connect to the database...');
//     try {
//         const client = await pool.connect();
//         console.log('Connected to the database successfully!');
//         return client;
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         throw error;
//     }
// };

// export default connectClient;
