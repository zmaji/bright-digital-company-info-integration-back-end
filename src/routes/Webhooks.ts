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

// DEFAULT: Grey
// SUCCESS: Green
// WARNING: Yellow
// DANGER: Red
// INFO: Blue

    // if (verified) {
    // const portalId = req.query.portalId;
    const dossierNumber = req.query.dossier_number;
    const tradeName = req.query.name;
    const objectId = req.query.associatedObjectId;
    let status: string;
    let statusType: string;
    let buttonLabel: string;
    let confirmationMessage: string;

    if (dossierNumber !== '' && dossierNumber !== undefined && dossierNumber !== null) {
      status = 'Synced';
      statusType = 'SUCCESS';
      buttonLabel = 'Sync with Company.info';
      confirmationMessage = `Are you sure you want to sync ${tradeName}?`
    } else {
      status = 'Not synced';
      statusType = 'DANGER';
      buttonLabel = 'Update company';
      confirmationMessage = `Are you sure you want to update ${tradeName}?`
    }

    const cardInformation = {
      'results': [
        {
          'objectId': objectId,
          'title': tradeName,
          'reporter_type': 'Account Manager',
          'status': 'In Progress',
          'ticket_type': 'Bug',
          'updated': '2016-09-28',
          'properties': [
            {
              'label': 'Trade name',
              'dataType': 'STRING',
              'value': tradeName,
            },
            {
              'label': 'Dossier number',
              'dataType': 'NUMERIC',
              'value': dossierNumber,
            },
            {
              'label': 'Company.info status',
              'dataType': 'STATUS',
              'value': status,
              'optionType': statusType,
            },
          ],
        },
      ],
      'primaryAction': {
        "type": "CONFIRMATION_ACTION_HOOK",
        "httpMethod": "POST",
        "uri": "https://example.com/action-hook",
        "label": "Example action",
        "associatedObjectProperties": [
          "some_crm_property"
        ],
        "confirmationMessage": "Are you sure you want to run example action?",
        "confirmButtonText": "Yes",
        "cancelButtonText": "No"
      },
      'settingsAction': {
        'type': 'IFRAME',
        'width': 890,
        'height': 748,
        'uri': 'https://example.com/settings-iframe-contents',
        'label': 'Settings',
      }
    };

    res.send(cardInformation);
    // }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred processing the webhook' });
  }
});

// router.get('/datarequest', async (req: Request, res: Response) => {
//   logger.info('Entered datarequest webhook route!');
//   try {
//     // const verified = await basicVerification(req);

// // DEFAULT: Grey
// // SUCCESS: Green
// // WARNING: Yellow
// // DANGER: Red
// // INFO: Blue

// // CURRENCY, DATE, DATETIME, EMAIL, LINK, NUMERIC, STATUS, STRING

//     // if (verified) {
//     // const portalId = req.query.portalId;
//     const dossierNumber = req.query.dossier_number;
//     const tradeName = req.query.name;
//     let status: string;
//     let statusType: string;
//     let buttonLabel: string;
//     let confirmationMessage: string;

//     if (dossierNumber !== '' && dossierNumber !== undefined && dossierNumber !== null) {
//       status = 'Synced';
//       statusType = 'SUCCESS';
//       buttonLabel = 'Sync with Company.info';
//       confirmationMessage = `Are you sure you want to sync ${tradeName}?`
//     } else {
//       status = 'Not synced';
//       statusType = 'DANGER';
//       buttonLabel = 'Update company';
//       confirmationMessage = `Are you sure you want to update ${tradeName}?`
//     }

//     const cardInformation = {
//       'results': [
//         {
//           'properties': [
//             {
//               'label': 'Trade name',
//               'dataType': 'STRING',
//               'value': tradeName,
//             },
//             {
//               'label': 'Dossier number',
//               'dataType': 'NUMERIC',
//               'value': dossierNumber,
//             },
//             {
//               'label': 'Company.info status',
//               'dataType': 'STATUS',
//               'value': status,
//               'optionType': statusType,
//             },
//           ],
//         },
//       ],
//       'primaryAction': {
//         "type": "CONFIRMATION_ACTION_HOOK",
//         "httpMethod": "POST",
//         "uri": "https://example.com/action-hook",
//         "label": buttonLabel,
//         "associatedObjectProperties": [
//           "some_crm_property"
//         ],
//         "confirmationMessage": buttonLabel,
//         "confirmButtonText": "Yes",
//         "cancelButtonText": "No"
//       },
//       'secondaryActions':[
//         {
//         'type': 'IFRAME',
//         'width': 890,
//         'height': 748,
//         'uri': 'https://example.com/settings-iframe-contents',
//         'label': 'Settings',
//         }
//       ]   
//     };

//     res.send(cardInformation);
//     // }
//   } catch (error) {
//     res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: 'An error occurred processing the webhook' });
//   }
// });

export default router;
