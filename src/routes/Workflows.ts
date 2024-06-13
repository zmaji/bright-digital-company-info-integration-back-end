import { Router, Request, Response } from 'express';
import logger from '../utils/Logger';
import dotenv from 'dotenv';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

dotenv.config();
const router = Router();

const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;
const HUBSPOT_APP_DEVELOPER_KEY = process.env.HUBSPOT_APP_DEVELOPER_KEY;

router.post('', async (req: Request, res: Response) => {
  try {
    const data = {
      actionUrl: 'https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/update',
      objectTypes: ['COMPANY'],
      objectRequestOptions: {
        properties: [
          'portalId',
          'dossier_number',
          'establishment_number',
        ],
      },
      labels: {
        en: {
          actionName: 'Update company',
          actionDescription: 'Update the current company with Company.info',
          appDisplayName: 'Company.info Integration',
          actionCardContent: 'Company.info action',
        },
      },
      functions: [
        {
          functionType: 'PRE_FETCH_OPTIONS',
          functionSource: 'exports.main = (event, callback) => {\r\n  callback({\r\n    "data": {\r\n      "field": "email",\r\n      "phone": "1234567890" \r\n    }\r\n  });\r\n',
        },
      ],
      published: true,
    };

    const response = await axios.post(
        `https://api.hubspot.com/automation/v4/actions/${HUBSPOT_APP_ID}`,
        data,
        {
          params: {
            hapikey: HUBSPOT_APP_DEVELOPER_KEY,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
    );

    if (response) {
      logger.success('Response received from HubSpot API');
      res.status(StatusCodes.OK).json({ status: 'success', data: response.data });
    }
  } catch (error) {
    logger.error('Error while creating custom workflow action', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
  }
});

export default router;
