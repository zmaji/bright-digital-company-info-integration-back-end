import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import companiesController from '../controllers/Companies';
import logger from '../utils/Logger';
import { retrieveHubToken } from '../controllers/Auth';

const router = Router();

router.post('/company', async (req: Request, res: Response) => {
  logger.info('Entered webhook routes!')
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

            const companyData = await companiesController.getCompanyInfo(event.propertyValue);

            if (companyData) {
              logger.info(`Successfully retrieved data for company with dossier number ${event.propertyName}`);

              const hubToken = await retrieveHubToken(event.portalId);

                if (hubToken) {
                  const result = await companiesController.updateCompany(hubToken, event.objectId, companyData);

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

export default router;
