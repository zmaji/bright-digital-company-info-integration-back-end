import { Router, Request, Response } from 'express';
import logger from '../utils/Logger';
import dotenv from 'dotenv';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';

dotenv.config();
const router = Router();

const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;
const HUBSPOT_APP_DEVELOPER_KEY = process.env.HUBSPOT_APP_DEVELOPER_KEY;

router.post('/definition', async (req: Request, res: Response) => {
    logger.info('Workflow has been triggered..');

    console.log('req body')
    console.log(req.body);

    const verified = await verifySignature(req);

    if (verified) {
        const source = req.body?.context?.source;
        const sourceId = req.body?.context?.workflowId;
        const actionDefinitionId = req.body?.origin?.actionDefinitionId;
        const objectType = req.body?.object?.objectType;
        const objectId = req.body?.object?.objectId;
        
        logger.info(`Processing ${source} with id ${sourceId} and action ${actionDefinitionId} targeting object ${objectType} with id ${objectId}`)

        const portalId = req.body?.origin?.portalId;
        const dossierNumber = req.body?.object?.properties?.dossier_number;
        const establishmentNumber = req.body?.object?.properties?.establishment_number;

        console.log('portalId');
        console.log(portalId);
        console.log('dossierNumber');
        console.log(dossierNumber);
        console.log('establishmentNumber');
        console.log(establishmentNumber);

        return res.status(StatusCodes.OK);
    } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Signature has not been verified' });
    }

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
            "actionName":"Update Company.info",
            "actionDescription":"Update company based on available dossier number and/or establishment number",
            "appDisplayName":"Company.info integration",
            "actionCardContent":"Company.info action"
          }
        },
        "functions":[
          {
            "functionType":"POST_ACTION_EXECUTION",
            "functionSource":"exports.main = (event, callback) => {\r\n  callback({\r\n    \"data\": {\r\n      \"field\": \"email\",\r\n      \"phone\": \"1234567890\" \r\n    }\r\n  });\r\n"
          },
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
