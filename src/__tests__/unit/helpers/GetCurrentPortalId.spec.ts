import axios from 'axios';
// import axios, { AxiosResponse } from 'axios';
import { getCurrentPortal } from '../../../helpers/hubspot/getCurrentPortalId';
import logger from '../../../utils/Logger';

jest.mock('../../../utils/Logger');

describe('getCurrentPortal Function Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const accessToken = 'mock_access_token';
  // const mockPortalId = 123;

  // test('should retrieve portal ID successfully', async () => {
  //   const axiosGetMock = jest.spyOn(axios, 'get');
  //   axiosGetMock.mockResolvedValueOnce({ data: { portalId: mockPortalId } } as AxiosResponse<{ portalId: number }>);

  //   const result = await getCurrentPortal(accessToken);

  //   expect(axiosGetMock).toHaveBeenCalledWith(
  //       'https://api.hubapi.com/integrations/v1/me',
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //   );

  //   expect(result).toEqual(mockPortalId);
  //   expect(logger.info).toHaveBeenCalledWith('Retrieving portal ID based on access token..');
  //   expect(logger.info).toHaveBeenCalledWith(`Successfully retrieved portal ID: ${mockPortalId}`);
  // });

  test('should handle error during portal ID retrieval', async () => {
    const axiosGetMock = jest.spyOn(axios, 'get');
    const errorMessage = 'Error retrieving portal ID';
    axiosGetMock.mockRejectedValueOnce(new Error(errorMessage));

    const result = await getCurrentPortal(accessToken);

    expect(axiosGetMock).toHaveBeenCalledWith(
        'https://api.hubapi.com/integrations/v1/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
    );

    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith('Retrieving portal ID based on access token..');
    expect(logger.info).toHaveBeenCalledWith(`Could not get Portal ID: Error: ${errorMessage}..`);
  });
});
