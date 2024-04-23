import type { HubToken } from '../../../typings/HubToken';

import companiesController from '../../../controllers/Companies';
import * as soap from 'soap';
// import axios from 'axios';
import logger from '../../../utils/Logger';
import { Company } from '../../../typings/Company';
import { CompanyDetail } from '../../../typings/CompanyDetail';
// import { formatCompanyData } from '../../../helpers/hubspot/formatCompanyData';

jest.mock('soap');
jest.mock('axios');
jest.mock('../../../utils/Logger');
jest.mock('../../../helpers/hubspot/formatCompanyData');

describe('companiesController Tests', () => {
  const tradeName = 'ExampleTrade';
  const dossierNumber = 123456;
  // const companyId = '1001';

  // const hubToken: HubToken = {
  //   id: 1,
  //   portal_id: null,
  //   access_token: 'token123',
  //   refresh_token: 'refreshTokenXYZ',
  //   expires_in: 3600,
  //   created_at: new Date(),
  //   updated_at: null,
  // };

  const mockCompany: Company = {
    dossier_number: '123456',
    name: 'ExampleCompany',
    establishment_number: '123456',
    match_type: '',
    establishment_city: '',
    establishment_street: '',
    correspondence_city: '',
    correspondence_street: '',
    indication_economically_active: false,
  };

  const mockCompanyDetail: CompanyDetail = {
    dossier_number: '123456',
    establishment_number: '789',
    trade_name: 'Example Company',
    establishment_address: {
      formatted: {
        street: '123 Main St',
        city: 'Example City',
        postcode: '12345',
      },
    },
    telephone_number: '123-456-7890',
    domain_name: 'example.com',
    primary_sbi_code: '1234',
    industry_companyinfo: 'Example Industry',
    personnel: '50',
    authorized_share_capital: '100000',
    revenue: '5000000',
    profit: '1000000',
    assets: '50000000',
    structure: {
      number_of_subsidiaries: '2',
      ultimate_parent: 'Parent Company',
      parent: 'Parent Company',
    },
  };

  const mockCompanyInfoUsername = 'xxx';
  const mockCompanyInfoPassword = '123';

  const mockCompanyDetailResponse: CompanyDetail = {
    out: {
      ...mockCompanyDetail,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCompanies should retrieve companies successfully', async () => {
    const mockClient = {
      addSoapHeader: jest.fn(),
      dutchBusinessSearchParametersV2Async: jest.fn().mockResolvedValue([{ out: { results: [mockCompany] } }]),
    };

    // @ts-ignore
    soap.createClientAsync.mockResolvedValue(mockClient);

    const result = await companiesController.getCompanies(tradeName, mockCompanyInfoUsername, mockCompanyInfoPassword);

    expect(result).toEqual([mockCompany]);
    expect(logger.info).toHaveBeenCalledWith(`Successfully found companies with trade name ${tradeName}`);
  });

  test('getCompanies should handle no companies found', async () => {
    const mockClient = {
      addSoapHeader: jest.fn(),
      dutchBusinessSearchParametersV2Async: jest.fn().mockResolvedValue([{ out: { results: null } }]),
    };
    // @ts-ignore
    soap.createClientAsync.mockResolvedValue(mockClient);

    const result = await companiesController.getCompanies(tradeName, mockCompanyInfoUsername, mockCompanyInfoPassword);

    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith('No companies found with trade name ExampleTrade');
  });

  test('getCompanies should handle SOAP client creation failure', async () => {
    const errorMessage = 'SOAP client creation failed';
    // @ts-ignore
    soap.createClientAsync.mockRejectedValue(new Error(errorMessage));

    try {
      await companiesController.getCompanies(tradeName, mockCompanyInfoUsername, mockCompanyInfoPassword);
    } catch (error) {
      expect(logger.error).toHaveBeenCalledWith('Something went wrong getting a company', expect.any(Error));
      // @ts-ignore
      expect(error.message).toBe(errorMessage);
    }
  });

  test('getCompanyInfo should retrieve company details successfully', async () => {
    const mockClient = {
      addSoapHeader: jest.fn(),
      dutchBusinessGetDossierV3: jest.fn((_, callback) => callback(null, mockCompanyDetailResponse)),
    };

    // @ts-ignore
    soap.createClientAsync.mockResolvedValue(mockClient);

    const result = await companiesController.getCompanyInfo(dossierNumber, mockCompanyInfoUsername, mockCompanyInfoPassword);

    expect(result).toEqual(mockCompanyDetail);
    expect(logger.info).toHaveBeenCalledWith(`Successfully found company with dossier number ${dossierNumber}`);
  });

  test('getCompanyInfo should handle no company found', async () => {
    const mockClient = {
      addSoapHeader: jest.fn(),
      dutchBusinessGetDossierV3: jest.fn((_, callback) => callback(null, { out: null })),
    };

    // @ts-ignore
    soap.createClientAsync.mockResolvedValue(mockClient);

    const result = await companiesController.getCompanyInfo(dossierNumber, mockCompanyInfoUsername, mockCompanyInfoPassword);

    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith(`No company found with dossier number ${dossierNumber}`);
  });

  test('getCompanyInfo should handle error during SOAP request', async () => {
    const errorMessage = 'SOAP request failed';
    // @ts-ignore
    soap.createClientAsync.mockRejectedValue(new Error(errorMessage));

    const result = await companiesController.getCompanyInfo(dossierNumber, mockCompanyInfoUsername, mockCompanyInfoPassword);

    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith('Something went wrong getting company information', expect.any(Error));
  });

  // test('updateCompany should update company successfully', async () => {
  //   // @ts-ignore
  //   formatCompanyData.mockReturnValue(formatCompanyData(mockCompanyDetail));

  //   const responseData = { mockCompanyDetail };
  //   // @ts-ignore
  //   axios.mockResolvedValue({ data: responseData });

  //   const result = await companiesController.updateCompany(hubToken, companyId, mockCompanyDetail);

  //   expect(formatCompanyData).toHaveBeenCalledWith(mockCompanyDetail);
  //   expect(axios).toHaveBeenCalledWith({
  //     method: 'patch',
  //     url: `https://api.hubapi.com/crm/v3/objects/company/${companyId}`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${hubToken.access_token}`,
  //     },
  //     data: JSON.stringify({
  //       properties: formatCompanyData,
  //     }),
  //   });
  //   expect(logger.info).toHaveBeenCalledWith('HubSpot company has successfully been updated');
  //   expect(logger.info).toHaveBeenCalledWith('Result:', responseData);
  //   expect(result).toEqual(responseData);
  // });

  // test('updateCompany should handle empty response data', async () => {
  //   // @ts-ignore
  //   formatCompanyData.mockReturnValue(formatCompanyData(mockCompanyDetail));

  //   // @ts-ignore
  //   axios.mockResolvedValue({ data: null });

  //   const result = await companiesController.updateCompany(hubToken, companyId, mockCompanyDetail);

  //   expect(formatCompanyData).toHaveBeenCalledWith(mockCompanyDetail);
  //   expect(axios).toHaveBeenCalledWith({
  //     method: 'patch',
  //     url: `https://api.hubapi.com/crm/v3/objects/company/${companyId}`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${hubToken.access_token}`,
  //     },
  //     data: JSON.stringify({
  //       properties: formatCompanyData,
  //     }),
  //   });
  //   expect(logger.error).toHaveBeenCalledWith('HubSpot company has not been updated');
  //   expect(result).toBeNull();
  // });

  // test('updateCompany should handle error during update', async () => {
  //   // @ts-ignore
  //   formatCompanyData.mockResolvedValue(formatCompanyData(mockCompanyDetail));

  //   const error = new Error('Axios error');
  //   // @ts-ignore
  //   axios.mockRejectedValue(error);

  //   const result = await companiesController.updateCompany(hubToken, companyId, mockCompanyDetail);

  //   expect(formatCompanyData).toHaveBeenCalledWith(mockCompanyDetail);
  //   expect(axios).toHaveBeenCalledWith({
  //     method: 'patch',
  //     url: `https://api.hubapi.com/crm/v3/objects/company/${companyId}`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${hubToken.access_token}`,
  //     },
  //     data: JSON.stringify({
  //       properties: formatCompanyData,
  //     }),
  //   });
  //   expect(logger.error).toHaveBeenCalledWith('Error while updating company:', error);
  //   expect(result).toBeNull();
  // });
});
