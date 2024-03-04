import axios, { AxiosResponse } from 'axios';

export const getCurrentPortal = async (accessToken: string): Promise<string | null> => {
  console.log(`Retrieving portal ID based on access token ${accessToken}..`);
  try {
    const response: AxiosResponse<any> = await axios({
      method: 'get',
      url: `https://api.hubapi.com/integrations/v1/me`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const portalId: string = response.data.portalId;
    console.log(`Successfully retrieved portal ID: ${portalId}`);
    return portalId;
  } catch (error) {
    console.log(`Could not get Portal ID with access token: ${accessToken}: ${error}..`);
    return null;
  }
};
