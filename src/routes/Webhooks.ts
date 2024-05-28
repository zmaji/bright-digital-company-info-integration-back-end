import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import companiesController from '../controllers/Companies';
import logger from '../utils/Logger';
import { retrieveHubToken } from '../controllers/Auth';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
// import { basicVerification } from '../helpers/hubspot/basicVerification';

const router = Router();

let COMPANY_INFO_USERNAME: string;
let COMPANY_INFO_PASSWORD: string;

router.post('/company', async (req: Request, res: Response) => {
  logger.info('Entered webhook routes!');
  try {
    const verified = await verifySignature(req);

    if (verified) {
      const events = req.body;

      if (events) {
        for (const event of events) {
          if (event.propertyName === 'dossier_number') {
            logger.info(
                `Property kvk_nummer has changed to ${event.propertyValue}` + `
                for company ${event.objectId}, retrieving company details..`,
            );

            if (event.portalId) {
              const currentUser: User | null = await usersController.getUser(event.portalId);

              COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
              COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;
            }

            if (COMPANY_INFO_USERNAME && COMPANY_INFO_PASSWORD) {
              // eslint-disable-next-line
              const companyData = await companiesController.getCompanyInfo(event.propertyValue, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);

              if (companyData) {
                logger.success(`Successfully retrieved data for company with dossier number ${event.propertyName}`);

                const hubToken = await retrieveHubToken(event.portalId);

                if (hubToken) {
                  const properties = await formatCompanyData(companyData);

                  if (properties) {
                    const result = await companiesController.updateCompany(hubToken, event.objectId, properties);

                    if (result) {
                      res
                          .status(StatusCodes.OK)
                          .json(result);
                    } else {
                      res
                          .status(StatusCodes.INTERNAL_SERVER_ERROR)
                          .json({ error: 'No company has been updated' });
                    }
                  } else {
                    res
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ error: 'No HubToken found' });
                  }
                }
              }
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'No company data found' });
          }
        }
      } else {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'No events found' });
      }
    } else {
      res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Signature has not been verified' });
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred processing the webhook' });
  }
});

router.get('/datarequest', async (req: Request, res: Response) => {
  logger.info('Entered datarequest webhook route!');
  try {
    // const verified = await basicVerification(req);

    // if (verified) {
    // const portalId = req.query.portalId;
    const dossierNumber = req.query.dossier_number;
    const tradeName = req.query.name;
    const objectId = req.query.associatedObjectId;

    const cardInformation = {
      'results': [
        {
          'objectId': objectId,
          'title': tradeName,
          'properties': [
            {
              'label': 'dossier number',
              'dataType': 'NUMBER',
              'value': dossierNumber,
            },
            {
              'label': 'Status',
              'dataType': 'STRING',
              'value': 'STATUS: TBA',
            },
          ],
          // 'actions': [
          //   {
          //     'type': 'IFRAME',
          //     'width': 890,
          //     'height': 748,
          //     'uri': 'https://example.com/edit-iframe-contents',
          //     'label': 'Edit',
          //     'associatedObjectProperties': [],
          //   },
          //   {
          //     'type': 'IFRAME',
          //     'width': 890,
          //     'height': 748,
          //     'uri': 'https://example.com/reassign-iframe-contents',
          //     'label': 'Reassign',
          //     'associatedObjectProperties': [],
          //   },
          //   {
          //     'type': 'ACTION_HOOK',
          //     'httpMethod': 'PUT',
          //     'associatedObjectProperties': [],
          //     'uri': 'https://example.com/tickets/245/resolve',
          //     'label': 'Resolve',
          //   },
          //   {
          //     'type': 'CONFIRMATION_ACTION_HOOK',
          //     'confirmationMessage': 'Are you sure you want to delete this ticket?',
          //     'confirmButtonText': 'Yes',
          //     'cancelButtonText': 'No',
          //     'httpMethod': 'DELETE',
          //     'associatedObjectProperties': [
          //       'protected_account',
          //     ],
          //     'uri': 'https://example.com/tickets/245',
          //     'label': 'Delete',
          //   },
          // ],
        },
        {
          'objectId': 988,
          'title': 'API-54: Question about bulk APIs',
          'link': 'http://example.com/2',
          'created': '2016-08-04',
          'priority': 'HIGH',
          'project': 'API',
          'reported_by': 'ksmith@hubspot.com',
          'description': 'Customer is not able to find documentation about our bulk Contacts APIs.',
          'reporter_type': 'Support Rep',
          'status': 'Resolved',
          'ticket_type': 'Bug',
          'updated': '2016-09-23',
          'properties': [
            {
              'label': 'Resolved by',
              'dataType': 'EMAIL',
              'value': 'ijones@hubspot.com',
            },
            {
              'label': 'Resolution type',
              'dataType': 'STRING',
              'value': 'Referred to documentation',
            },
            {
              'label': 'Resolution impact',
              'dataType': 'CURRENCY',
              'value': '94.34',
              'currencyCode': 'GBP',
            },
          ],
          'actions': [
            {
              'type': 'IFRAME',
              'width': 890,
              'height': 748,
              'uri': 'https://example.com/edit-iframe-contents',
              'label': 'Edit',
            },
            {
              'type': 'CONFIRMATION_ACTION_HOOK',
              'confirmationMessage': 'Are you sure you want to delete this ticket?',
              'confirmButtonText': 'Yes',
              'cancelButtonText': 'No',
              'httpMethod': 'DELETE',
              'associatedObjectProperties': [
                'protected_account',
              ],
              'uri': 'https://example.com/tickets/245',
              'label': 'Delete',
            },
          ],
        },
      ],
      'settingsAction': {
        'type': 'IFRAME',
        'width': 890,
        'height': 748,
        'uri': 'https://example.com/settings-iframe-contents',
        'label': 'Settings',
      },
      'primaryAction': {
        'type': 'IFRAME',
        'width': 890,
        'height': 748,
        'uri': 'https://example.com/create-iframe-contents',
        'label': 'Create Ticket',
      },
    };

    res.send(cardInformation);
    // }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred processing the webhook' });
  }
});

export default router;
