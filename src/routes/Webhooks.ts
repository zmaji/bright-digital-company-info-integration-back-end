import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import companiesController from '../controllers/Companies';
import logger from '../utils/Logger';
import authController from '../controllers/Auth';
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

const parseDate = (dateString: string) => {
  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  return new Date(Date.UTC(year, month - 1, day, hours - 2, minutes, seconds));
};

const isLessThan10SecondsAgo = (lastSyncString: string) => {
  const lastSyncDate = parseDate(lastSyncString);
  const currentDate = new Date();

  const timeDifferenceInSeconds = (currentDate.getTime() - lastSyncDate.getTime()) / 1000;

  return timeDifferenceInSeconds >= 0 && timeDifferenceInSeconds < 10;
};

router.post('/company', async (req: Request, res: Response) => {
  logger.info('Entered webhook routes!');
  try {
    const verified = await verifySignature(req);

    if (!verified) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Signature has not been verified' });
    }

    const events = req.body;

    if (!events) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No events found' });
    }

    for (const event of events) {
      if (event.propertyName !== 'dossier_number' && event.propertyName !== 'establishment_number') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No company data found' });
      }

      logger.info(
          `Property ${event.propertyName} has changed to ${event.propertyValue} for company ${event.objectId}, retrieving company details..`,
      );

      if (!event.propertyValue) {
        logger.success(`Emptied ${event.propertyName}, aborting webhook..`);

        return res.status(StatusCodes.OK).json({ error: `No ${event.propertyName}` });
      }

      if (event.portalId) {
        const currentUser: User | null = await usersController.getUser(event.portalId);

        if (currentUser) {
          COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
          COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

          if (COMPANY_INFO_USERNAME && COMPANY_INFO_PASSWORD) {
            const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

            if (hubToken) {
              const hubSpotCompany = await companiesController.getHubSpotCompany(hubToken.access_token, event.objectId);

              if (hubSpotCompany) {
                const dossierNumber = event.propertyName === 'dossier_number' ? event.propertyValue : hubSpotCompany.properties.dossier_number;
                const establishmentNumber = event.propertyName === 'establishment_number' ? event.propertyValue : hubSpotCompany.properties.establishment_number;

                const lastSynced = hubSpotCompany.properties.last_sync;
                const wasRecentlySynced = isLessThan10SecondsAgo(lastSynced);

                if (wasRecentlySynced) {
                  logger.success('Company was recently synced, webhook stopped');

                  return res.status(200).send('Event already processed, aborting webhook..');
                }

                let companyData: CompanyDetail;

                if (establishmentNumber && dossierNumber) {
                  logger.info(`Establishment number ${establishmentNumber} found, updating accordingly..`);
                  companyData = await companiesController.getCompanyInfo(dossierNumber, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD, establishmentNumber);
                } else if (establishmentNumber && !dossierNumber) {
                  logger.info(`No dossier number found, aborting webhook...`);
                  return res.status(StatusCodes.OK).json({ error: 'Webhook aborted from retrying..' });
                } else {
                  logger.info(`No establishment number found, updating with dossier number ${dossierNumber}..`);
                  companyData = await companiesController.getCompanyInfo(dossierNumber, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);
                }

                if (companyData) {
                  const syncDate = new Date();
                  const formattedDate = formatDate(syncDate);

                  companyData = { ...companyData, last_sync: formattedDate };

                  const properties = await formatCompanyData(companyData);

                  if (properties) {
                    const result = await companiesController.updateCompany(hubToken, event.objectId, properties);

                    if (result) {
                      return res.status(StatusCodes.OK).json(result);
                    } else {
                      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'No company has been updated' });
                    }
                  } else {
                    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No HubToken found' });
                  }
                } else {
                  return res.status(StatusCodes.OK).json({ error: 'Webhook aborted from retrying..' });
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred processing the webhook' });
    }
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
    const companyId = req.query.companyId as string;

    if (portalId) {
      currentUser = await usersController.getUser(portalId);

      if (currentUser) {
        COMPANY_INFO_USERNAME = currentUser.companyInfoUserName;
        COMPANY_INFO_PASSWORD = currentUser.companyInfoPassword;

        const hubToken: HubToken | null = await authController.retrieveHubToken(portalId);

        if (hubToken) {
          const hubSpotCompany = await companiesController.getHubSpotCompany(hubToken.access_token, companyId);

          if (hubSpotCompany) {
            let companyData: CompanyDetail;

            if (hubSpotCompany.properties.establishment_number) {
              logger.info(`Establishment number ${hubSpotCompany.properties.establishment_number} found, updating accordingly..`);
              companyData = await companiesController.getCompanyInfo(dossierNumber, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD, hubSpotCompany.properties.establishment_number);
            } else {
              logger.info('No establishment number found, updating with dossier number..');
              companyData = await companiesController.getCompanyInfo(dossierNumber, COMPANY_INFO_USERNAME, COMPANY_INFO_PASSWORD);
            }

            const syncDate = new Date();
            const formattedDate = formatDate(syncDate);

            companyData = { ...companyData, last_sync: formattedDate };

            if (companyData) {
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
        } else {
          return res.status(StatusCodes.OK).json({ error: 'Webhook aborted from retrying..' });
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
  try {
    // @ts-expect-error unknown Ts request error
    const verified = await basicVerification(req);

    if (verified) {
      companyId = req.query.associatedObjectId as string;

      const portalId = req.query.portalId as string;
      const tradeName = req.query.name as string;
      const objectId = req.query.associatedObjectId;

      logger.info(`Loading CRM card for company with id ${objectId}`);

      let dossierNumber = req.query.dossier_number as string;
      let establishmentNumber = req.query.establishment_number as string;
      const lastSync = req.query.last_sync as string;
      let status: string;
      let statusType: string;
      let buttonLabel: string;
      let buttonUri: string;
      let primaryAction: object;
      let secondaryActions: object[];

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
                'label': 'Company.info status',
                'dataType': 'STATUS',
                'value': status,
                'optionType': statusType,
              },
              {
                'label': 'Dossier number',
                'dataType': 'STRING',
                'value': dossierNumber,
              },
              {
                'label': 'Establishment number',
                'dataType': 'STRING',
                'value': establishmentNumber,
              },
            ],
          },
        ],
        primaryAction,
      };

      if (lastSync) {
        cardInformation.results[0].properties.push({
          label: 'Last sync',
          dataType: 'STRING',
          value: lastSync,
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
