import type { ExchangeProof } from '../../typings/ExchangeProof';
import type { HubToken } from '../../typings/HubToken';

import axios, { AxiosResponse } from 'axios';

export const exchangeTokens = async (exchangeProof: ExchangeProof): Promise<HubToken | null> => {
  console.log(`Exchanging tokens with HubSpot..`);
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
    console.log(error);

    return null;
  }
};
