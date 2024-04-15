import type { HubToken } from '../../../typings/HubToken';

import { storeHubTokens } from '../../../helpers/database/storeHubToken';
import logger from '../../../utils/Logger';
import { prismaMock } from '../../utils/singleton';

jest.mock('../../../utils/Logger');

describe('storeHubTokens Function Tests', () => {
  const HubToken: HubToken = {
    id: 1,
    portal_id: 123,
    access_token: 'access_token_value',
    refresh_token: 'refresh_token_value',
    expires_in: 3600,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new record if hubtoken does not exist', async () => {
    prismaMock.hubToken.findUnique.mockResolvedValueOnce(null);
    prismaMock.hubToken.create.mockResolvedValueOnce(HubToken);

    if (HubToken.portal_id) {
      const result = await storeHubTokens(HubToken, HubToken.portal_id);

      expect(prismaMock.hubToken.findUnique).toHaveBeenCalledWith({ where: { portal_id: HubToken.portal_id } });
      expect(prismaMock.hubToken.create).toHaveBeenCalledWith({
        data: {
          portal_id: HubToken.portal_id,
          access_token: HubToken.access_token,
          refresh_token: HubToken.refresh_token,
          expires_in: HubToken.expires_in,
          updated_at: expect.any(Date),
        } });
      expect(logger.info).toHaveBeenCalledWith('New tokens created successfully!');
      expect(result).toEqual(HubToken);
    }
  });

  test('should update an existing record if hubtoken exists', async () => {
    const updatedHubToken: HubToken = {
      ...HubToken,
      updated_at: new Date(),
    };

    prismaMock.hubToken.findUnique.mockResolvedValueOnce(HubToken);
    prismaMock.hubToken.update.mockResolvedValueOnce(updatedHubToken);

    if (HubToken.portal_id) {
      const result = await storeHubTokens(HubToken, HubToken.portal_id);

      expect(prismaMock.hubToken.findUnique).toHaveBeenCalledWith({ where: { portal_id: HubToken.portal_id } });
      expect(prismaMock.hubToken.update).toHaveBeenCalledWith({
        where: { id: HubToken.id },
        data: {
          portal_id: HubToken.portal_id,
          access_token: HubToken.access_token,
          refresh_token: HubToken.refresh_token,
          expires_in: HubToken.expires_in,
          updated_at: expect.any(Date),
        },
      });
      expect(logger.info).toHaveBeenCalledWith(`Record with portal ID ${HubToken.portal_id} already exists, updating record instead..`);
      expect(logger.info).toHaveBeenCalledWith('Tokens updated successfully!');
      expect(result).toEqual(updatedHubToken);
    }
  });
});
