import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import companiesController from '../controllers/Companies';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';
import isLoggedIn from '../middleware/IsLoggedIn';
import { User } from '../typings/User';
import usersController from '../controllers/Users';
import { HubToken } from '../typings/HubToken';
import authController from '../controllers/Auth';

const router = Router();

router.get('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

      if (currentUser && currentUser.companyInfoUserName && currentUser.companyInfoPassword) {

    const tradeName = req.query.tradeName ? String(req.query.tradeName) : undefined;

    if (tradeName) {
      const result = await companiesController.getCompanies(tradeName, currentUser.companyInfoUserName, currentUser.companyInfoPassword);

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
  }
}
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving a company' });
  }
});

router.get('/info', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

          if (currentUser && currentUser.companyInfoUserName && currentUser.companyInfoPassword) {
            const dossierNumber = req.query.dossierNumber ? Number(req.query.dossierNumber) : undefined;

            if (dossierNumber) {
              const result = await companiesController.getCompanyInfo(dossierNumber, currentUser.companyInfoUserName, currentUser.companyInfoPassword);
              const formattedResult = await formatCompanyData(result);
        
              if (formattedResult) {
                res
                    .status(StatusCodes.OK)
                    .json(formattedResult);
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
          }
      }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred retrieving info' });
  }
});

router.get('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const result = await companiesController.getCompany(hubToken.access_token);

            if (result) {
              res
                  .status(StatusCodes.OK)
                  .json(result);
            } else {
              res
                  .status(StatusCodes.NOT_FOUND)
                  .json({ error: 'Unable to get companies' });
            }
          } else {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: 'Unauthorized' });
          }
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'No user or portal id found' });
        }
      }
    } catch {
      res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'An error occurred retrieving info' });
    }
});

router.post('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken && req.body.companyData) {
            const companyData = req.body.companyData;
      
            if (companyData && Object.keys(companyData).length > 0) {
              const result = await companiesController.createCompany(hubToken, companyData);
        
              if (result) {
                res
                    .status(StatusCodes.OK)
                    .json(result);
              } else {
                res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: `Unable to create a company` });
              }
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: 'No data provided' });
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

router.put('/hubspot', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
      const emailAddress: string = req.user.emailAddress;
      const currentUser: User | null = await usersController.getUser(emailAddress);

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken && req.body.companyId && req.body.companyData) {
            const companyId: string = typeof req.body.companyId === 'string' ? req.body.companyId : '';
            const companyData: Object = typeof req.body.companyData === 'object' ? req.body.companyData : {};
      
            if (companyId && companyId !== '' && companyData && Object.keys(companyData).length > 0) {
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
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An error occurred updating a company' });
  }
});

export default router;
