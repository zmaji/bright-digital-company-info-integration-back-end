import { Router, Request, Response } from 'express';
import logger from '../utils/Logger';
import dotenv from 'dotenv';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import { CompanyDetail } from '../typings/CompanyDetail';
import companiesController from '../controllers/Companies';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';
import authController from '../controllers/Auth';
import { HubToken } from '../typings/HubToken';

dotenv.config();
const router = Router();

const HUBSPOT_APP_ID = process.env.HUBSPOT_APP_ID;
const HUBSPOT_APP_DEVELOPER_KEY = process.env.HUBSPOT_APP_DEVELOPER_KEY;

const formatDate = (date: Date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Amsterdam',
    };
  
    // @ts-expect-error options not part of..
    const formattedDateParts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
  
    const day = formattedDateParts.find((part) => part.type === 'day').value;
    const month = formattedDateParts.find((part) => part.type === 'month').value;
    const year = formattedDateParts.find((part) => part.type === 'year').value;
    const hours = formattedDateParts.find((part) => part.type === 'hour').value;
    const minutes = formattedDateParts.find((part) => part.type === 'minute').value;
    const seconds = formattedDateParts.find((part) => part.type === 'second').value;
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  router.post('/definition', async (req: Request, res: Response) => {
    logger.info('Workflow has been triggered..');

    try {
        const verified = await verifySignature(req);

        if (verified) {
            const source = req.body?.context?.source;
            const sourceId = req.body?.context?.workflowId;
            const actionDefinitionId = req.body?.origin?.actionDefinitionId;
            const objectType = req.body?.object?.objectType;
            const objectId = req.body?.object?.objectId;

            logger.info(`Processing ${source} with id ${sourceId} and action ${actionDefinitionId} targeting object ${objectType} with id ${objectId}`);

            const portalId = req.body?.origin?.portalId;
            const dossierNumber = req.body?.object?.properties?.dossier_number;
            const establishmentNumber = req.body?.object?.properties?.establishment_number;

            if (dossierNumber && portalId) {
                const currentUser: User | null = await usersController.getUser(portalId);

                if (currentUser) {
                    const companyInfoUserName = currentUser.companyInfoUserName;
                    const companyInfoPassword = currentUser.companyInfoPassword;

                    if (companyInfoUserName && companyInfoPassword) {
                        const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

                        if (hubToken) {
                            let companyData: CompanyDetail;

                            if (dossierNumber && establishmentNumber) {
                                logger.info(`Establishment number ${establishmentNumber} found, updating accordingly..`);

                                companyData = await companiesController.getCompanyInfo(dossierNumber, companyInfoUserName, companyInfoPassword, establishmentNumber);
                            } else if (establishmentNumber && !dossierNumber) {
                                logger.info(`No dossier number found, aborting workflow...`);

                                return res.status(StatusCodes.OK).json({ error: 'Workflow aborted from retrying..' });
                            } else {
                                logger.info(`No establishment number found, updating with dossier number ${dossierNumber}..`);

                                companyData = await companiesController.getCompanyInfo(dossierNumber, companyInfoUserName, companyInfoPassword);
                            };

                            if (companyData) {
                                const syncDate = new Date();
                                const formattedDate = formatDate(syncDate);

                                companyData = { ...companyData, last_sync: formattedDate };

                                const properties = await formatCompanyData(companyData);

                                if (properties) {
                                    const result = await companiesController.updateCompany(hubToken, objectId, properties);

                                    if (result) {
                                        return res.status(StatusCodes.OK).json({ message: `Company with ID ${objectId} has been successfully updated through workflow ` });
                                    } else {
                                        logger.error('Company has not been updated (no result)');
                                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No company has been updated' });
                                    }
                                }
                            }
                        } else {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'No HubSpot user found' });
                        }
                    } else {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'No compamny info username or company info password found' });
                    }
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'No user found' });
                }
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'No dossier number or portal id found' });
            }
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Signature has not been verified' });
        }
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
