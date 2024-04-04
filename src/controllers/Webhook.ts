import axios from 'axios';
import logger from '../utils/Logger';

const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;
const HUBSPOT_APP_DEVELOPER_KEY = process.env.HUBSPOT_APP_DEVELOPER_KEY;

const getWebHook = async () => {
  logger.info('Finding HubSpot webhook..');

  try {
    const response = await axios.get(
      `https://api.hubapi.com/webhooks/v3/${HUBSPOT_APP_ID}/settings`,
      {
        params: {
          hapikey: HUBSPOT_APP_DEVELOPER_KEY
        },
      }
    );

    if (response.data) {
      logger.info(JSON.stringify(response.data));
      logger.info('HubSpot Webhook already initialized');
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const createWebHook = async (period: string, maxConcurrentRequests: number, targetUrl: string) => {
  logger.info('Initializing a HubSpot Webhook..');

  try {
    const data = {
      throttling: {
        period: period,
        maxConcurrentRequests: maxConcurrentRequests
      },
      targetUrl: targetUrl
    };

    const response = await axios.post(
      `https://api.hubapi.com/webhooks/v3/${HUBSPOT_APP_ID}/settings`,
      data,
      {
        params: {
          hapikey: HUBSPOT_APP_DEVELOPER_KEY
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      logger.info(JSON.stringify(response.data));
      logger.info('Webhook created successfully');
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const updateWebHook = async (period: string, maxConcurrentRequests: number, targetUrl: string) => {
  logger.info('Updating a HubSpot Webhook..');

  try {
    const data = {
      throttling: {
        period: period,
        maxConcurrentRequests: maxConcurrentRequests
      },
      targetUrl: targetUrl
    };

    const response = await axios.put(
      `https://api.hubapi.com/webhooks/v3/${HUBSPOT_APP_ID}/settings`,
      data,
      {
        params: {
          hapikey: HUBSPOT_APP_DEVELOPER_KEY
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      logger.info(JSON.stringify(response.data));
      logger.info('Webhook updated successfully');
      logger.info('Webhook target URL changed to:', targetUrl);
      logger.info(targetUrl);
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const getSubcriptions = async () => {
  logger.info('Finding Webhook subscription..');

  try {
    const response = await axios.get(
      `https://api.hubapi.com/webhooks/v3/${HUBSPOT_APP_ID}/subscriptions`,
      {
        params: {
          hapikey: HUBSPOT_APP_DEVELOPER_KEY
        },
      }
    );

    if (Array.isArray(response.data.results) && response.data.results.length === 0) {
      logger.warn('No Webhook subscriptions found');
      return [];
    } else {
      logger.info('Returning all webhook subscriptions');
      return response.data.results;
    }
  } catch (error) {
    console.error(error);
  }
};

const createSubscription = async (propertyName: string, active: boolean, eventType: string) => {
  logger.info('Initializing a Webhook subscription..');

  try {
    const data = {
      propertyName: propertyName,
      active: active,
      eventType: eventType
    };

    const response = await axios.post(
      `https://api.hubapi.com/webhooks/v3/${HUBSPOT_APP_ID}/subscriptions`,
      data,
      {
        params: {
          hapikey: HUBSPOT_APP_DEVELOPER_KEY
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      logger.info(JSON.stringify(response.data));
      logger.info('Subscription created successfully');
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const webHookController = {
  getWebHook,
  getSubcriptions,
  createWebHook,
  updateWebHook,
  createSubscription,
};

export default webHookController;

