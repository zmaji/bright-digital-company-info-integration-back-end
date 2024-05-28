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
    const portalId = req.query.portalId;
    let dossierNumber = req.query.dossier_number;
    let dossierDataType = 'NUMERIC';
    const tradeName = req.query.name;
    const objectId = req.query.associatedObjectId;
    let status: string;
    let statusType: string;
    let buttonLabel: string;
    let confirmationMessage: string;

    if (dossierNumber !== '' && dossierNumber !== undefined && dossierNumber !== null) {
      // DEFAULT: Grey
      // SUCCESS: Green
      // WARNING: Yellow
      // DANGER: Red
      // INFO: Blue
      status = 'Synced';
      statusType = 'SUCCESS';
      buttonLabel = 'Update company';
      confirmationMessage = `Are you sure you want to update ${tradeName}?`
    } else {
      status = 'Not synced';
      statusType = 'DANGER';
      buttonLabel = 'Sync with Company.info';
      confirmationMessage = `Are you sure you want to sync ${tradeName}?`
      dossierNumber = 'Unknown';
      dossierDataType = 'STRING';
    }

    const cardInformation = {
      'results': [
        {
          'objectId': objectId,
          'title': `Current company: ${tradeName}`,
          'properties': [
            // {
            //   'label': 'Trade name',
            //   'dataType': 'STRING',
            //   'value': tradeName,
            // },
            {
              'label': 'Dossier number',
              'dataType': dossierDataType,
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
      // 'primaryAction': {
      //   "type": "CONFIRMATION_ACTION_HOOK",
      //   "httpMethod": "POST",
      //   "uri": "https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/iframe-contents",
      //   "label": buttonLabel,
      //   "associatedObjectProperties": [
      //     "some_crm_property"
      //   ],
      //   "confirmationMessage": confirmationMessage,
      //   "confirmButtonText": "Yes",
      //   "cancelButtonText": "No"
      // },
      primaryAction:
      // [
          {
            type: 'IFRAME',
            width: 890,
            height: 748,
            // @ts-ignore
            // uri: `https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/iframe-contents`,
            uri: `https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/iframe-contents?portalId=${encodeURIComponent(portalId)}&tradeName=${encodeURIComponent(tradeName)}`,
            label: buttonLabel,
          },
      // ]
    };

    res.send(cardInformation);
    // }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred processing the webhook' });
  }
});

router.get('/iframe-contents', async (req: Request, res: Response) => {
  const portalId = parseInt(req.query.portalId as string, 10);
  const tradeName = req.query.tradeName as string;

  console.log('req.query');
  console.log(req.query);

  if (portalId) {
    const currentUser: User | null = await usersController.getUser(portalId);
    const result = await companiesController.getCompanies(tradeName, currentUser.companyInfoUserName, currentUser.companyInfoPassword);
    console.log('result')
    console.log(result)
  }
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Select Option</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .option { margin: 10px 0; }
        .option button { padding: 10px; }
      </style>
    </head>
    <body>
      <h1>Search results for trade name ${tradeName}</h1>

      <div id="options-container"></div>

      <script>
        const options = [
          { id: 1, name: 'Option 1' },
          { id: 2, name: 'Option 2' },
          { id: 3, name: 'Option 3' },
        ];
        
        const container = document.getElementById('options-container');
        
        options.forEach(option => {
          const div = document.createElement('div');
          div.className = 'option';
          div.innerHTML = \`<button onclick="selectOption(\${option.id})">\${option.name}</button>\`;
          container.appendChild(div);
        });

        function selectOption(optionId) {
        }
      </script>
    </body>
    </html>
  `);
});

export default router;
