import ngrok from 'ngrok';
import logger from './Logger';
import dotenv from 'dotenv';
import { promisify } from 'util';
import fs from 'fs';

dotenv.config();

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const startTunnel = async () => {
    try {
        const envPath = '.env';
        const envContent = await readFileAsync(envPath, 'utf8');
        const lines = envContent.split('\n').filter(line => !line.startsWith('NGROK_FORWARDING_URL'));
        const forwardingUrl = await ngrok.connect(3000);
        const updatedEnvContent = `${lines.join('\n')}\nNGROK_FORWARDING_URL=${forwardingUrl}`;
        await writeFileAsync(envPath, updatedEnvContent);
        logger.info('Forwarding URL set to:');
        logger.info(forwardingUrl);
    } catch (error) {
        logger.error('Error starting a Ngrok tunnel', error);
    }
}

startTunnel();