import { Request } from 'express';
import { verifySignature } from '../../../helpers/hubspot/verifySignature';
import logger from '../../../utils/Logger';

jest.mock('../../../utils/Logger');

describe('verifySignature function', () => {
  type MockRequest = Partial<Request>;

  const mockRequest: MockRequest = {
    headers: {
      'x-hubspot-request-timestamp': '1234567890',
      'x-hubspot-signature-v3': 'mock_signature',
    },
    method: 'POST',
    originalUrl: '/some/path',
    get: jest.fn().mockImplementation((header: string) => {
      if (header === 'host') return 'example.com';

      return '';
    }),
    body: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return false for invalid signature', () => {
    const invalidMockRequest = {
      ...mockRequest,
      headers: {
        ...mockRequest.headers,
        'x-hubspot-signature-v3': 'invalid_signature',
      },
    };

    const result = verifySignature(invalidMockRequest as Request);
    expect(result).toBe(false);
  });

  it('should return false if timestamp is too old', () => {
    const expiredTimestampMockRequest = {
      ...mockRequest,
      headers: {
        ...mockRequest.headers,
        'x-hubspot-request-timestamp': '1',
      },
    };

    const result = verifySignature(expiredTimestampMockRequest as Request);
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalledWith('Timestamp of incoming HubSpot webhook is too old, rejecting request');
  });

  it('should return false if client secret or signature is missing', () => {
    const missingSecretAndSignatureMockRequest = {
      ...mockRequest,
      headers: {},
    };

    const result = verifySignature(missingSecretAndSignatureMockRequest as Request);
    expect(result).toBe(false);
  });

  it('should return false if environment variable is missing', () => {
    delete process.env.HUBSPOT_CLIENT_SECRET;

    const result = verifySignature(mockRequest as Request);
    expect(result).toBe(false);
  });
});
