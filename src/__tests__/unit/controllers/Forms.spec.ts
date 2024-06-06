import formsController from '../../../controllers/Forms';
import axios from 'axios';
import logger from '../../../utils/Logger';
import { HubToken } from '../../../typings/HubToken';

jest.mock('axios');
jest.mock('../../../utils/Logger');

describe('formsController Tests', () => {
  const hubToken: HubToken = {
    id: 1,
    portal_id: null,
    access_token: 'token123',
    refresh_token: 'refreshTokenXYZ',
    expires_in: 3600,
    created_at: new Date(),
    updated_at: null,
  };

  const mockFormData = {
    name: 'Example Form',
    action: 'https://example.com/form-submit',
    method: 'POST',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getForms should handle empty response data', async () => {
    // @ts-ignore
    axios.mockResolvedValue({ data: null, status: 200 });

    const result = await formsController.getForms(hubToken);

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: 'https://api.hubapi.com/marketing/v3/forms/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
    });

    expect(logger.error).toHaveBeenCalledWith('HubSpot forms were not retrieved');
    expect(result).toBeNull();
  });

  test('createForm should handle empty response data', async () => {
    // @ts-ignore
    axios.mockResolvedValue({ data: null, status: 201 });

    const result = await formsController.createForm(hubToken, mockFormData);

    expect(axios).toHaveBeenCalledWith({
      method: 'post',
      url: 'https://api.hubapi.com/marketing/v3/forms/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
      data: JSON.stringify(mockFormData),
    });

    expect(logger.error).toHaveBeenCalledWith('HubSpot form was not created');
    expect(result).toBeNull();
  });
});
