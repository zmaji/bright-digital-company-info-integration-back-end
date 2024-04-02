
import type { User } from '../typings/User';
import type { HubToken } from '../typings/HubToken';
import { PropertyField } from '../typings/PropertyField';

import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import propertiesController from '../controllers/Properties';
import userController from '../controllers/Users';
import authController from '../controllers/Auth';
import isLoggedIn from '../middleware/IsLoggedIn';
import { generatePropertyFields } from '../helpers/hubspot/hubSpotProperties';
import { compareProperties } from '../helpers/hubspot/compareProperties';

const router = Router();

router.get('', isLoggedIn, async (req: Request, res: Response) => {
  try {
    if (req.user && req.user.emailAddress) {
    const emailAddress: string | undefined = req.user?.emailAddress;
    const currentUser: User | null = await userController.getUser(emailAddress);

    if (req.body && req.body.groupName && req.body.objectType) {
      const groupName: string = req.body.groupName;
      const objectType: string = req.body.objectType;

        if (currentUser && currentUser.hubSpotPortalId) {
          const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

          if (hubToken) {
            const properties = await propertiesController.getProperties(hubToken.access_token, objectType);

            if (properties) {
              res
                  .status(StatusCodes.OK)
                  .json(`Successfully retrieved properties from group ${groupName}`);
            } else {
              res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: `retrieved properties from group ${groupName}` });
            }
          } else {
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: `Unable to retrieve hub token` });
          }
        } else {
          res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: `Unauthorized` });
        }
      } else {
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'No group name and object type provided' });
      }
    }
  } catch {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: `An error occurred retrieving properties` });
  }
});

// eslint-disable-next-line
// router.post('', isLoggedIn, async (req: Request, res: Response) => {
//   try {
//     if (req.user && req.user.emailAddress) {
//     const emailAddress: string | undefined = req.user?.emailAddress;
//     const currentUser: User | null = await userController.getUser(emailAddress);

//     if (req.body && req.body.groupName && req.body.objectType) {
//       const groupName: string = req.body.groupName;
//       const objectType: string = req.body.objectType;

//         if (currentUser && currentUser.hubSpotPortalId) {
//           const hubToken: HubToken | null = await authController.retrieveHubToken(currentUser.hubSpotPortalId);

//           if (hubToken) {
//             const currentProperties = await propertiesController.getProperties(hubToken.access_token, groupName);

//             if (currentProperties) {
//               const propertyFields = await generatePropertyFields(groupName);
//               await compareProperties(currentProperties, propertyFields);
//             }

//             const result = await propertiesController.createProperties(hubToken.access_token, groupName, objectType);

//             if (result) {
//               res
//                   .status(StatusCodes.OK)
//                   .json('Successfully created properties');
//             } else {
//               res
//                   .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                   .json({ error: `Unable to create properties` });
//             }
//           } else {
//             res
//                 .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                 .json({ error: `Unable to retrieve hub token` });
//           }
//         } else {
//           logger.info('Not logged in!');
//         }
//       }
//     }
//   } catch {
//     res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json({ error: 'An error occurred creating properties' });
//   }
// });

export default router;
