import type { ExchangeProof } from '../../typings/ExchangeProof';
import type { HubToken } from '../../typings/HubToken';

import axios, { AxiosResponse } from 'axios';
import logger from '../../utils/Logger';

function encodeFormData(data: any) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export const exchangeTokens = async (exchangeProof: ExchangeProof): Promise<HubToken | null> => {
  const formUrl = encodeFormData(exchangeProof);

  try {
    logger.info(`Exchanging tokens with HubSpot..`);

    const response: AxiosResponse<HubToken> = await axios.post('https://api.hubapi.com/oauth/v1/token', formUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const hubToken: HubToken = response.data;
    return hubToken;
  } catch (error) {
    logger.error(error);

    return null;
  }
};
