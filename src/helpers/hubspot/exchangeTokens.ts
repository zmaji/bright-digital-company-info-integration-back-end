import type { ExchangeProof } from '../../typings/ExchangeProof';
import type { HubToken } from '../../typings/HubToken';

import axios, { AxiosResponse } from 'axios';
import logger from '../../utils/Logger';

export const exchangeTokens = async (exchangeProof: ExchangeProof): Promise<HubToken | null> => {
  logger.info(`Exchanging tokens with HubSpot..`);
  try {
    const response: AxiosResponse<HubToken> = await axios.post('https://api.hubapi.com/oauth/v1/token', exchangeProof, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const hubToken: HubToken = response.data;

    return hubToken;
  } catch (error) {
    logger.info(error);

    return null;
  }
};