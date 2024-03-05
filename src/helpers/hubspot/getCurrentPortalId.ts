import axios, { AxiosResponse } from 'axios';

export const getCurrentPortal = async (accessToken: string): Promise<number | null> => {
  console.log(`Retrieving portal ID based on access token..`);
  try {
    const response: AxiosResponse = await axios.get(`https://api.hubapi.com/integrations/v1/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const portalId: number = response.data.portalId;
    console.log(`Successfully retrieved portal ID: ${portalId}`);

    return portalId;
  } catch (error) {
    console.log(`Could not get Portal ID: ${error}..`);

    return null;
  }
};
