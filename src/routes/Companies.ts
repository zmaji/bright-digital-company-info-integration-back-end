import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import companiesController from '../controllers/Companies';
import isLoggedIn from '../middleware/IsLoggedIn';

const router = Router();

// router.get('', isLoggedIn async (req: Request, res: Response) => {
router.get('', async (req: Request, res: Response) => {
  try {
    const tradeName = req.query.tradeName ? String(req.query.tradeName) : undefined;

    if (tradeName) {
      const result = await companiesController.getCompany(tradeName);

      if (result) {
        res
            .status(StatusCodes.OK)
            .json(result);
      } else {
        res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `Unable to get company with trade name ${tradeName}` });
      }
    } else {
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Trade name has not been provided' });
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a company' });
  }
});

// router.get('', isLoggedIn async (req: Request, res: Response) => {
  router.get('/info', async (req: Request, res: Response) => {
    try {
      const dossierNumber = req.query.dossierNumber ? String(req.query.dossierNumber) : undefined;
  
      if (dossierNumber) {
        const result = await companiesController.getCompanyInfo(dossierNumber);
  
        if (result) {
          res
              .status(StatusCodes.OK)
              .json(result);
        } else {
          res
              .status(StatusCodes.NOT_FOUND)
              .json({ error: `Unable to get information with dossier number ${dossierNumber}` });
        }
      } else {
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Dossier number has not been provided' });
      }
    } catch {
      res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'An error occurred retrieving info' });
    }
  });

export default router;
