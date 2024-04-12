import axios from 'axios';
import webHookController from '../../controllers/Webhook';
import logger from '../../utils/Logger';

jest.mock('axios');
jest.mock('../../utils/Logger');

describe('webHookController Tests', () => {
  const period = 'weekly';
  const maxConcurrentRequests = 20;
  const targetUrl = 'https://www.example.com/hubspot/target';

  const webhook = {
    throttling: {
      period: period,
      maxConcurrentRequests: maxConcurrentRequests,
    },
    targetUrl: `${targetUrl}/webhooks/company`,
  };

  const webhookReponse = {
    createdAt: '2024-04-12T11:30:09.527Z',
    throttling: {
      period: 'weekly',
      maxConcurrentRequests: 20,
    },
    targetUrl: 'https://www.example.com/hubspot/target/webhooks/company',
    updatedAt: '2024-04-12T11:30:09.527Z',
  };

  const axiosResponse = {
    data: webhookReponse,
  };

  const subscriptionResponse = {
    results: [
      {
        createdAt: '2024-04-12T11:30:09.563Z',
        propertyName: 'string',
        active: true,
        eventType: 'contact.propertyChange',
        id: 'string',
        updatedAt: '2024-04-12T11:30:09.563Z',
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve webhook successfully', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue(axiosResponse);

    const result = await webHookController.getWebHook();

    expect(axios.get).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/settings`, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
    });

    expect(logger.info).toHaveBeenCalledWith('Finding HubSpot webhook..');
    expect(logger.info).toHaveBeenCalledWith(JSON.stringify(webhookReponse));
    expect(logger.info).toHaveBeenCalledWith('HubSpot Webhook already initialized');
    expect(result).toEqual(webhookReponse);
  });

  test('should create webhook successfully', async () => {
    // @ts-ignore
    axios.post.mockResolvedValue({ data: webhook });

    const result = await webHookController.createWebHook(period, maxConcurrentRequests, targetUrl);

    expect(axios.post).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/settings`, webhook, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(logger.info).toHaveBeenCalledWith('Initializing a HubSpot Webhook..');
    expect(logger.info).toHaveBeenCalledWith(JSON.stringify(webhook));
    expect(logger.info).toHaveBeenCalledWith('Webhook created successfully');
    expect(result).toEqual(webhook);
  });

  test('should update webhook successfully', async () => {
    // @ts-ignore
    axios.put.mockResolvedValue({ data: webhook });

    const result = await webHookController.updateWebHook(period, maxConcurrentRequests, targetUrl);

    expect(axios.put).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/settings`, webhook, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(logger.info).toHaveBeenCalledWith('Updating a HubSpot Webhook..');
    expect(logger.info).toHaveBeenCalledWith(JSON.stringify(webhook));
    expect(logger.info).toHaveBeenCalledWith('Webhook updated successfully');
    expect(logger.info).toHaveBeenCalledWith('Webhook target URL changed to:', `${targetUrl}/webhooks/company`);
    expect(logger.info).toHaveBeenCalledWith(`${targetUrl}/webhooks/company`);
    expect(result).toEqual(webhook);
  });

  test('should retrieve webhook subscriptions successfully', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: subscriptionResponse });

    const result = await webHookController.getSubcriptions();

    expect(axios.get).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/subscriptions`, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
    });
    expect(logger.info).toHaveBeenCalledWith('Finding Webhook subscription..');
    expect(logger.info).toHaveBeenCalledWith('Returning all webhook subscriptions');
    expect(result).toEqual(subscriptionResponse.results);
  });

  test('should handle no subscriptions found', async () => {
    // @ts-ignore
    axios.get.mockResolvedValue({ data: { results: [] } });

    const result = await webHookController.getSubcriptions();

    expect(axios.get).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/subscriptions`, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
    });
    expect(logger.info).toHaveBeenCalledWith('Finding Webhook subscription..');
    expect(logger.warn).toHaveBeenCalledWith('No Webhook subscriptions found');
    expect(result).toEqual([]);
  });

  test('should create webhook subscription successfully', async () => {
    const propertyName = 'exampleProperty';
    const active = true;
    const eventType = 'exampleEvent';

    const requestData = {
      propertyName: propertyName,
      active: active,
      eventType: eventType,
    };

    const responseData = { subscription: 'created' };

    // @ts-ignore
    axios.post.mockResolvedValue({ data: responseData });

    const result = await webHookController.createSubscription(propertyName, active, eventType);

    expect(axios.post).toHaveBeenCalledWith(`https://api.hubapi.com/webhooks/v3/${process.env.HUBSPOT_APP_ID}/subscriptions`, requestData, {
      params: { hapikey: process.env.HUBSPOT_APP_DEVELOPER_KEY },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(logger.info).toHaveBeenCalledWith('Initializing a Webhook subscription..');
    expect(logger.info).toHaveBeenCalledWith(JSON.stringify(responseData));
    expect(logger.info).toHaveBeenCalledWith('Subscription created successfully');
    expect(result).toEqual(responseData);
  });
});
