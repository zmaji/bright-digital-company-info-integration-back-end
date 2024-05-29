import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import companiesController from '../controllers/Companies';
import logger from '../utils/Logger';
import authController, { retrieveHubToken } from '../controllers/Auth';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
import { HubToken } from '../typings/HubToken';
// import { basicVerification } from '../helpers/hubspot/basicVerification';

const router = Router();

let COMPANY_INFO_USERNAME: string;
let COMPANY_INFO_PASSWORD: string;
let currentUser: User | null;
let companyId: any;

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

router.put('/update', async (req: Request, res: Response) => {
  try {
    const portalId = parseInt(req.body.portalId as string, 10);

      if (portalId) {
        const hubToken: HubToken | null = await authController.retrieveHubToken(portalId);
        const companyId = req.body.companyId as string;
        const companyData = req.body.companyData;
  
        if (hubToken && companyId && companyData) {
          if (companyId && companyId !== '' && Object.keys(companyData).length > 0) {
            const result = await companiesController.updateCompany(hubToken, companyId, companyData);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: `Unable to update a company with id ${companyId}` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'No company or data provided' });
          }
        }
      }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred updating a company' });
  }
});

router.get('/datarequest', async (req: Request, res: Response) => {
  logger.info('Entered datarequest webhook route!');
  try {
    // const verified = await basicVerification(req);

    // if (verified) {
    companyId = req.query.associatedObjectId;
    const portalId = req.query.portalId;
    let dossierNumber = req.query.dossier_number;
    let dossierDataType = 'NUMERIC';
    const tradeName = req.query.name;
    const objectId = req.query.associatedObjectId;
    let status: string;
    let statusType: string;
    let buttonLabel: string;

    if (dossierNumber !== '' && dossierNumber !== undefined && dossierNumber !== null) {
      status = 'Synced';
      statusType = 'SUCCESS';
      buttonLabel = 'Update company';
    } else {
      status = 'Not synced';
      statusType = 'DANGER';
      buttonLabel = 'Sync with Company.info';
      dossierNumber = 'Unknown';
      dossierDataType = 'STRING';
    }

    const cardInformation = {
      'results': [
        {
          'objectId': objectId,
          'title': `Current company: ${tradeName}`,
          'properties': [
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
      'primaryAction':
          {
            type: 'IFRAME',
            width: 890,
            height: 748,
            // @ts-ignore
            uri: `https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/iframe-contents?portalId=${encodeURIComponent(portalId)}&tradeName=${encodeURIComponent(tradeName)}`,
            label: buttonLabel,
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

router.get('/iframe-contents', async (req: Request, res: Response) => {
  const portalId = parseInt(req.query.portalId as string, 10);
  const tradeName = req.query.tradeName as string;

  if (portalId) {
    currentUser = await usersController.getUser(portalId);

    COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
    COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

    const result = await companiesController.getCompanies(tradeName, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);
    console.log(result);

    // @ts-ignore
    if (result.item && result.item.length > 0) { // Check if result.item exists and has length greater than 0
      res.send(`
        <!DOCTYPE html>
        <html lang="en">  
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Select Option</title>
          <style>
            body { font-family: Campton, sans-serif; padding: 20px; }
            .u-flex { display: flex; flex-wrap: wrap; }
            .c-search-row__line {
              width: 100%;
              height: 1px;
              background-color: lightblue;
              margin-top: 24px;
              margin-bottom: 24px;
            }
            .c-search-row__content-container {
              width: 100%;
              align-items: center;
            }
            .c-search-row__name-container {
              width: 25%;
            }
            .c-search-row__name {
              font-size: 16px;
              font-weight: 600;
              margin-right: 48px;
            }
            .c-search-row__address {
              font-size: 16px;
              font-weight: 300;
            }
            .c-search-row__location {
              font-size: 16px;
              font-weight: 300;
            }
            .c-search-row__button-container {
              margin-left: auto;
            }
            .v-search-results__text {
              font-size: 16px;
              font-weight: 300;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Search results for trade name ${tradeName}</h1>

          <div className='v-search-results__text'>These search results display all companies matching your search criteria. Select a result to sync or update.</div>

          <div id="options-container"></div>

          <script>
            const result = ${JSON.stringify(result.item)};
            const portalId = ${JSON.stringify(portalId)};
            const companyId = ${JSON.stringify(companyId)};

            function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }

            const modifiedResults = result.map(item => ({
              ...item,
              correspondence_city: capitalizeFirstLetter(item.correspondence_city)
            }));
            
            const container = document.getElementById('options-container');
            
            modifiedResults.forEach(item => {
              const div = document.createElement('div');
              div.className = 'c-search-row u-flex';
              div.innerHTML = 
              \`
                <div class="c-search-row__line"></div>
                <div class="c-search-row__content-container u-flex">
                  <div class="c-search-row__name-container u-flex">
                    <div class="c-search-row__name">\${item.name}</div>
                  </div>

                  <div class="c-search-row__address-container u-flex">
                    <div class="c-search-row__address">\${item.correspondence_street}&nbsp;|</div>
                    <div class="c-search-row__location">&nbsp;\${item.correspondence_city}</div>
                  </div>

                  <div class="c-search-row__button-container">
                    <button onclick="selectOption('\${item.dossier_number}')">Select</button>
                  </div>
                </div>
              \`;
              container.appendChild(div);
            });

            async function selectOption(dossierNumber) {
                try {
                  const response = await fetch('/webhooks/update', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      portalId: portalId,
                      companyId: companyId,
                      companyData: {
                        "dossier_number": dossierNumber
                      }
                    })
                  });
        
                  const result = await response.json();
                  if (response.ok) {
                    window.parent.postMessage(JSON.stringify({"action": "DONE"}), "*");
                  } else {
                    console.error(result.error);
                  }
                } catch (error) {
                  console.error('Error fetching company info:', error);
                }
              }
          </script>
        </body>
        </html>
      `);
    } else {
      // If result.item doesn't exist or has length 0
      res.status(404).send('No matching companies found');
    }
  } else {
    res.status(400).send('Invalid portalId');
  }
});

export default router;
