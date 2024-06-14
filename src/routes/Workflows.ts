import { Router, Request, Response } from 'express';
import logger from '../utils/Logger';
import dotenv from 'dotenv';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

dotenv.config();
const router = Router();

const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;
const HUBSPOT_APP_DEVELOPER_KEY = process.env.HUBSPOT_APP_DEVELOPER_KEY;

router.post('/definition', async (req: Request, res: Response) => {
    console.log('Entered action url POST..');

    console.log('req')
    console.log('req')
    console.log('req')
    console.log('req')
    console.log(req)

    try {
        res.status(StatusCodes.CREATED);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
    }
});

  router.get('', async (req: Request, res: Response) => {
    try {
      const response = await axios.get(
          `https://api.hubspot.com/automation/v4/actions/${HUBSPOT_APP_ID}`,
          {
            params: {
              hapikey: HUBSPOT_APP_DEVELOPER_KEY,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          },
      );
  
      if (response && response.data) {
        logger.success(`Successfully retrieved workflow actions`);
        res.status(StatusCodes.OK).json({ status: 'success', data: response.data });
      }
    } catch (error) {
      logger.error('Error while retrieving workflow actions', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
    }
});

router.post('', async (req: Request, res: Response) => {
    try {
    //   const data = {
    //     actionUrl: 'https://company-info-bright-c6c99ec34e11.herokuapp.com/workflows/definition',
    //     objectTypes: ['COMPANY'],
    //     objectRequestOptions: {
    //       properties: [
    //         'portalId',
    //         'dossier_number',
    //         'establishment_number',
    //       ],
    //     },
    //     labels: {
    //       en: {
    //         actionName: 'Update company',
    //         actionDescription: 'Update the current company with Company.info',
    //         appDisplayName: 'Company.info Integration',
    //         actionCardContent: 'Company.info action',
    //       },
    //     },
    //     functions: [
    //       {
    //         functionType: 'PRE_FETCH_OPTIONS',
    //         functionSource: '...',
    //       },
    //     ],
    //     published: true,
    //   };

    // !!HUBSPOT EXAMPLE ACTION DEFINTION!!
    const data = {
        "published":"true",
        "actionUrl":"https://company-info-bright-c6c99ec34e11.herokuapp.com/workflows/definition",
        "objectTypes":[
          "COMPANY"
        ],
        "objectRequestOptions":{
          "properties":[
            "dossier_number",
            "establishment_number",
          ]
        },
        "labels":{
          "en":{
            "actionName":"My Extension!!",
            "actionDescription":"My Extension Description!!",
            "appDisplayName":"My App Display Name!!",
            "actionCardContent":"My Action Card Content!!"
          }
        },
        "functions":[
          {
            "functionType":"POST_ACTION_EXECUTION",
            "functionSource":"exports.main = (event, callback) => {\r\n  callback({\r\n    outputFields: {\r\n      myOutput: \"example output value\"\r\n    }\r\n  });\r\n}"
          },
          {
            "functionType":"POST_FETCH_OPTIONS",
            "functionSource":"exports.main = (event, callback) => {\r\n  callback({\r\n    \"options\": [{\r\n        \"label\": \"Big Widget\",\r\n        \"description\": \"Big Widget\",\r\n        \"value\": \"10\"\r\n      },\r\n      {\r\n        \"label\": \"Small Widget\",\r\n        \"description\": \"Small Widget\",\r\n        \"value\": \"1\"\r\n      }\r\n    ]\r\n  });\r\n}"
          }
        ]
      }
  
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
  
      if (response && response.data) {
        logger.success(`Successfully created a workflow action with id ${response.data.id}`);
        res.status(StatusCodes.OK).json({ status: 'success', data: response.data });
      }
    } catch (error) {
      logger.error('Error while creating custom workflow action', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
    }
  });

router.delete('/:definitionId', async (req: Request, res: Response) => {
    const { definitionId } = req.params;

    try {
      const response = await axios.delete(
          `https://api.hubspot.com/automation/v4/actions/${HUBSPOT_APP_ID}/${definitionId}`,
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
        logger.success(`Successfully deleted a workflow action with id ${definitionId}`);
        res.status(StatusCodes.OK).json({ status: 'success', data: response.data });
      }
    } catch (error) {
      logger.error('Error while deleting a workflow action with id ${definitionId}', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
    }
  });

export default router;
