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
import { basicVerification } from '../helpers/hubspot/basicVerification';
import { CompanyDetail } from '../typings/CompanyDetail';

const router = Router();

let COMPANY_INFO_USERNAME: string;
let COMPANY_INFO_PASSWORD: string;
let currentUser: User | null;
let companyId: string;

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDateFromTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
};

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
              `Property kvk_nummer has changed to ${event.propertyValue} for company ${event.objectId}, retrieving company details..`
            );

            if (event.portalId) {
              const currentUser: User | null = await usersController.getUser(event.portalId);

              if (currentUser) {
                COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
                COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

                if (COMPANY_INFO_USERNAME && COMPANY_INFO_PASSWORD) {
                  const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

                  if (hubToken) {
                    const hubSpotCompany = await companiesController.getHubSpotCompany(hubToken.access_token, event.objectId);
                    const establishmentNumber = hubSpotCompany.establishment_number ? hubSpotCompany.establishment_number as string : undefined;

                    if (hubSpotCompany) {
                      let companyData: CompanyDetail;

                      console.log('event dossier')
                      console.log('event dossier')
                      console.log('event dossier')
                      console.log('event dossier')
                      console.log(event.propertyValue)

                      console.log('event establish')
                      console.log('event establish')
                      console.log('event establish')
                      console.log('event establish')
                      console.log(establishmentNumber)

                      if (establishmentNumber !== '' || establishmentNumber !== null || establishmentNumber !== undefined) {
                        companyData = await companiesController.getCompanyInfo(event.propertyValue, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD, establishmentNumber);
                      } else {
                        companyData = await companiesController.getCompanyInfo(event.propertyValue, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);
                      }

                      const syncDate = new Date();
                      const formattedDate = formatDate(syncDate);

                      companyData = { ...companyData, last_sync: formattedDate };

                      if (companyData) {
                        logger.success(`Successfully retrieved data for company with dossier number ${event.propertyName}`);

                        const properties = await formatCompanyData(companyData);

                        if (properties) {
                          const result = await companiesController.updateCompany(hubToken, event.objectId, properties);

                          if (result) {
                            res.status(StatusCodes.OK).json(result);
                          } else {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No company has been updated' });
                          }
                        } else {
                          res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No HubToken found' });
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No company data found' });
          }
        }
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No events found' });
      }
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Signature has not been verified' });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred processing the webhook' });
  }
});


router.put('/sync', async (req: Request, res: Response) => {
  try {
    const portalId = parseInt(req.body.portalId as string, 10);
    const companyId = req.body.companyId as string;
    const companyData = req.body.companyData;

    if (portalId) {
      const hubToken: HubToken | null = await authController.retrieveHubToken(portalId);

      if (hubToken) {
        const currentUser: User | null = await usersController.getUser(hubToken.portal_id);

        if (currentUser) {
          COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
          COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

          if (currentUser && companyId && companyData) {
            if (companyId && companyId !== '' && Object.keys(companyData).length > 0) {
              // eslint-disable-next-line
              let company = await companiesController.getCompanyInfo(companyData.dossier_number, currentUser.companyInfoUserName, currentUser.companyInfoPassword, companyData.establishment_number);

              const syncDate = new Date();
              const formattedDate = formatDate(syncDate);
              company = { ...company, last_sync: formattedDate };

              const formattedResult = await formatCompanyData(company);

              if (formattedResult) {
                const result = await companiesController.updateCompany(hubToken, companyId, formattedResult);

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
        }
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred updating a company' });
  }
});

router.put('/update', async (req: Request, res: Response) => {
  logger.info('Trying to update a HubSpot company..');
  try {
    const dossierNumber = req.query.dossierNumber ? req.query.dossierNumber as string : undefined;
    const portalId = parseInt(req.query.portalId as string, 10);

    if (portalId) {
      currentUser = await usersController.getUser(portalId);

      if (currentUser) {
        COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
        COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

        // eslint-disable-next-line
        let companyData = await companiesController.getCompanyInfo(dossierNumber, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);

        const syncDate = new Date();
        const formattedDate = formatDate(syncDate);

        companyData = { ...companyData, last_sync: formattedDate };

        if (companyData) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(portalId);
          const companyId = req.query.companyId as string;

          if (hubToken && companyId && companyData) {
            if (companyId && companyId !== '') {
              const formattedCompany = await formatCompanyData(companyData);
              const result = await companiesController.updateCompany(hubToken, companyId, formattedCompany);

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
    // @ts-expect-error unknown Ts request error
    const verified = await basicVerification(req);

    if (verified) {
      companyId = req.query.associatedObjectId as string;

      const portalId = req.query.portalId as string;
      const tradeName = req.query.name as string;
      const objectId = req.query.associatedObjectId;

      let dossierNumber = req.query.dossier_number as string;
      let establishmentNumber = req.query.establishment_number as string;
      const lastSync = req.query.last_sync as string;
      let status: string;
      let statusType: string;
      let buttonLabel: string;
      let buttonUri: string;
      let primaryAction: object;
      let secondaryActions: object[];
      let dossierDataType = 'NUMERIC';

      const createButtonUri = (baseUri: string, params: Record<string, string>) => {
        const queryParams = new URLSearchParams(params).toString();

        return `${baseUri}?${queryParams}`;
      };

      if (dossierNumber && establishmentNumber) {
        status = 'Synced';
        statusType = 'SUCCESS';
        buttonLabel = 'Update company';
        buttonUri = createButtonUri('https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/update', {
          portalId,
          dossierNumber,
          companyId,
        });
        primaryAction = {
          type: 'ACTION_HOOK',
          httpMethod: 'PUT',
          uri: buttonUri,
          label: buttonLabel,
        };
        secondaryActions = [
          {
            type: 'IFRAME',
            width: 890,
            height: 748,
            uri: createButtonUri('https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/search', {
              portalId,
              tradeName,
            }),
            label: 'Resync company',
          },
        ];
      } else {
        status = 'Not synced';
        statusType = 'DANGER';
        buttonLabel = 'Sync with Company.info';
        dossierNumber = 'Unknown';
        establishmentNumber = 'Unknown';
        dossierDataType = 'STRING';
        buttonUri = createButtonUri('https://company-info-bright-c6c99ec34e11.herokuapp.com/webhooks/search', {
          portalId,
          tradeName,
        });
        primaryAction = {
          type: 'IFRAME',
          width: 890,
          height: 748,
          uri: buttonUri,
          label: buttonLabel,
        };
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
                'label': 'Establishment number',
                'dataType': dossierDataType,
                'value': establishmentNumber,
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
        primaryAction,
      };

      if (lastSync) {
        const formattedLastSync = formatDateFromTimestamp(lastSync);
        cardInformation.results[0].properties.push({
          label: 'Last sync',
          dataType: 'STRING',
          value: formattedLastSync,
        });
      }

      if (status === 'Synced') {
        // @ts-expect-error secondaryActions is not part of Type cardInformation
        cardInformation.secondaryActions = secondaryActions;
      }

      res.send(cardInformation);
    }
  } catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred processing the webhook' });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  const portalId = parseInt(req.query.portalId as string, 10);
  const tradeName = req.query.tradeName as string;

  if (portalId) {
    try {
      const currentUser = await usersController.getUser(portalId);

      const COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
      const COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

      const result = await companiesController.getCompanies(tradeName, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);
      // @ts-expect-error item is not part of result (ts error)
      const companies = result.item;

      if (companies && companies.length > 0) {
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
              .c-search-row__address-container {
                width: 33%;
              }
              .c-search-row__number-container {
                width: 33%;
                margin-left: auto;
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
              .c-search-row__kvk {
                font-size: 16px;
                font-weight: 300;
              }
              .c-search-row__establishment {
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
              .c-input-container {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
              }
              .c-input-container input {
                font-size: 16px;
                padding: 8px;
                margin-right: 10px;
                flex: 1;
              }
              .c-input-container button {
                font-size: 16px;
                padding: 8px 16px;
              }
            </style>
          </head>
          <body>
            <h1>Search results for trade name ${tradeName}</h1>
            
            <div class='v-search-results__text'>
              These search results display all companies matching your search criteria. 
              Select a result to sync or update.
            </div>

            <form class='c-input-container' id="search-form" method="get" action="/webhooks/search">
              <input type="hidden" name="portalId" value="${portalId}">
              <input type="text" name="tradeName" value="${tradeName}" placeholder="Enter trade name">
              <button type="submit">Search</button>
            </form>

            <div id="options-container"></div>

            <script>
              const result = ${JSON.stringify(companies)};
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

                    <div class="c-search-row__number-container u-flex">
                    <div class="c-search-row__kvk">\${item.dossier_number}&nbsp;|</div>
                    <div class="c-search-row__establishment">&nbsp;\${item.establishment_number}</div>
                  </div>

                    <div class="c-search-row__button-container">
                      <button onclick="selectOption('\${item.dossier_number}', 
                      '\${item.establishment_number}')">Select</button>
                    </div>
                  </div>
                \`;
                container.appendChild(div);
              });

              async function selectOption(dossierNumber, establishmentNumber) {
                  try {
                    const response = await fetch('/webhooks/sync', {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        portalId: portalId,
                        companyId: companyId,
                        companyData: {
                          "dossier_number": dossierNumber,
                          "establishment_number": establishmentNumber
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
        res.send(`
          <!DOCTYPE html>
          <html lang="en">  
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>No Results Found</title>
            <style>
              body { font-family: Campton, sans-serif; padding: 20px; }
              .v-search-results__text {
                font-size: 16px;
                font-weight: 300;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <h1>No results found for trade name ${tradeName}</h1>

            <form class='c-input-container' id="search-form" method="get" action="/webhooks/search">
              <input type="hidden" name="portalId" value="${portalId}">
              <input type="text" name="tradeName" value="${tradeName}" placeholder="Enter trade name">
              <button type="submit">Search</button>
            </form>
            
            <div class='v-search-results__text'>
              No companies matched your search criteria. Please try again with a different trade name.
            </div>
          </body>
          </html>
        `);
      }
    } catch (error) {
      logger.error('Error fetching company info:', error);

      res.send(`
        <!DOCTYPE html>
        <html lang="en">  
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
            body { font-family: Campton, sans-serif; padding: 20px; }
            .v-search-results__text {
              font-size: 16px;
              font-weight: 300;
              margin-bottom: 20px;
              color: red;
            }
          </style>
        </head>
        <body>
          <h1>An error occurred</h1>
          
          <div class='v-search-results__text' id='error-message'>
            There was an error processing your request. Please try again later.
          </div>

          <script>
            const errorMessage = ${JSON.stringify(error.message)};
            const errorDiv = document.getElementById('error-message');
            
            if (errorMessage.includes('not have enough credits')) {
              errorDiv.innerText = 'Insufficient credits to perform this search. Please check your account balance.';
            } else {
              errorDiv.innerText = 'There was an error processing your request. Please try again later.';
            }

            console.error('Error details:', errorMessage);
          </script>
        </body>
        </html>
      `);
    }
  } else {
    res.status(400).send('Invalid portalId');
  }
});

export default router;
