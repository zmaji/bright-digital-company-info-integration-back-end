import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifySignature } from '../helpers/hubspot/verifySignature';
import companiesController from '../controllers/Companies';
import logger from '../utils/Logger';

const router = Router();

router.post('/company', async (req: Request, res: Response) => {
  try {
    const verified = await verifySignature(req);

    if (verified) {
      const events = req.body

      if (events) {
        for (const event of events) {
          if (event.propertName === 'dossier_number') {
          console.info(`Property kvk_nummer has changed to ${event.propertyValue} for company ${event.objectId}, retrieving company details..`);
          const companyData = await companiesController.getCompanyInfo(event.propertyValue);

          if (companyData) {
            const result = await companiesController.updateCompany(event.objectId, companyData);

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
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ error: 'No company data found' });
          }
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