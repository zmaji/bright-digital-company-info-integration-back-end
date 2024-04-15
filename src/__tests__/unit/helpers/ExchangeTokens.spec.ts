import type { ExchangeProof } from '../../../typings/ExchangeProof';
import type { HubToken } from '../../../typings/HubToken';

import axios, { AxiosResponse } from 'axios';
import { exchangeTokens } from '../../../helpers/hubspot/exchangeTokens';
import logger from '../../../utils/Logger';

jest.mock('../../../utils/Logger');

describe('exchangeTokens Function Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const exchangeProof: ExchangeProof = {
    grant_type: 'authorization_code',
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    redirect_uri: 'your_redirect_uri',
    code: 'authorization_code',
  };

  const mockHubToken: HubToken = {
    id: 1,
    portal_id: 123,
    access_token: 'mock_access_token',
    refresh_token: 'mock_refresh_token',
    expires_in: 3600,
    created_at: new Date(),
    updated_at: null,
  };

  test('should exchange tokens successfully', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post');
    axiosPostMock.mockResolvedValueOnce({ data: mockHubToken } as AxiosResponse<HubToken>);

    const result = await exchangeTokens(exchangeProof);

    expect(axiosPostMock).toHaveBeenCalledWith(
        'https://api.hubapi.com/oauth/v1/token',
        expect.any(String),
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
    );

    expect(result).toEqual(mockHubToken);
    expect(logger.info).toHaveBeenCalledWith('Exchanging tokens with HubSpot..');
  });

  test('should handle error during token exchange', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post');
    const errorMessage = 'Error exchanging tokens';
    axiosPostMock.mockRejectedValueOnce(new Error(errorMessage));

    const result = await exchangeTokens(exchangeProof);

    expect(axiosPostMock).toHaveBeenCalledWith(
        'https://api.hubapi.com/oauth/v1/token',
        expect.any(String),
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
    );

    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
  });
});

