import type { ExchangeProof } from '../../typings/ExchangeProof';
import type { ExchangeResponse } from '../../typings/ExchangeResponse';

import axios, { AxiosResponse } from 'axios';
import { getCurrentPortal } from '../../helpers/hubspot/getCurrentPortalId';
import { storeTokens } from '../../helpers/database/storeTokens';

interface Tokens {
  access_token: string;
}

export const exchangeTokens = async (currentPortalId: string | null, exchangeProof: ExchangeProof): Promise<ExchangeResponse | false> => {
    console.log(`Exchanging tokens with HubSpot..`);
    try {
      const response: AxiosResponse<Tokens> = await axios({
        method: 'post',
        url: 'https://api.hubapi.com/oauth/v1/token',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: exchangeProof
      });
  
      const tokens: Tokens = response.data;
      console.log('tokens');
      console.log(tokens);
      const portalId: string | null = currentPortalId ? currentPortalId : await getCurrentPortal(tokens.access_token);
  
      if (portalId) {
        const result = await storeTokens(tokens, portalId);
        if (result) {
          return {
            accessToken: tokens.access_token,
            portalId: portalId
          };
        } else {
          console.log('Could not store tokens');
          return false;
        }
      } else {
        console.log(`Could not get the portal ID, no way to store tokens`);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };