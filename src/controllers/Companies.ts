import type { Company } from '../typings/Company';
import type { CompanyDetail } from '../typings/CompanyDetail';
import type { HubToken } from '../typings/HubToken';

import axios, { AxiosError, AxiosResponse } from 'axios';
import * as soap from 'soap';
import logger from '../utils/Logger';

const companyInfoURL = 'https://ws1.webservices.nl/soap_doclit?wsdl';

// eslint-disable-next-line
const getCompanies = async (tradeName: string, companyInfoUsername: string, companyInfoPassword: string): Promise<Company[] | null> => {
  const headerArguments = { username: companyInfoUsername, password: companyInfoPassword };

  try {
    const client = await soap.createClientAsync(companyInfoURL);
    const soapHeader = {
      'HeaderLogin': headerArguments,
    };

    client.addSoapHeader(soapHeader);

    const searchParameters = {
      trade_name: tradeName,
    };

    const result = await client.dutchBusinessSearchParametersV2Async(searchParameters);

    if (result && result[0]?.out?.results) {
      logger.success(`Successfully found companies with trade name ${tradeName}`);

      return result[0].out.results as Company[];
    } else {
      logger.info(`No companies found with trade name ${tradeName}`);

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting a company', error);
    throw error;
  }
};

// eslint-disable-next-line
const getCompanyInfo = async (dossierNumber: number, companyInfoUsername: string, companyInfoPassword: string, establishmentNumber?: number): Promise<CompanyDetail | null> => {
  logger.info('Trying to get company info');
  const headerArguments = { username: companyInfoUsername, password: companyInfoPassword };

  try {
    const client = await soap.createClientAsync(companyInfoURL);
    const soapHeader = {
      'HeaderLogin': headerArguments,
    };

    client.addSoapHeader(soapHeader);

    const searchParameters = {
      dossier_number: dossierNumber,
    };
    
    if (establishmentNumber) {
      // @ts-expect-error establishment_number not part of SearchParameters
      searchParameters.establishment_number = establishmentNumber;
    }

    // eslint-disable-next-line
    const result: CompanyDetail = await new Promise((resolve: any, reject: any) => {
      // eslint-disable-next-line
      client.dutchBusinessGetDossierV3(searchParameters, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result && result.out) {
      logger.success(`Successfully found company with dossier number ${dossierNumber}`);

      return result.out;
    } else {
      logger.info(`No company found with dossier number ${dossierNumber}`);

      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting company information', error);

    return null;
  }
};

const getCompany = async (accessToken: string) => {
  logger.info(`Getting all companies..`);

  const limit = 10;
  const archived = false;

  try {
    const response: AxiosResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/companies?limit=${limit}&archived=${archived}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

    const result = response.data;

    if (result) {
      logger.success('Successfully retrieved all companies');

      return result;
    } else {
      logger.info('No companies retrieved');

      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 404) {
        logger.warn('No existing companies found');

        return null;
      }
    }
    logger.error('Something went wrong retrieving companies', error);
    throw error;
  }
};

const createCompany = async (hubToken: HubToken, companyData: CompanyDetail): Promise<CompanyDetail | null> => {
  logger.info(`Trying to create a company with dossier number ${companyData.dossier_number}`);

  delete companyData.legal_name;

  const updatedCompanyData = {
    name: companyData.trade_name_full,
    ...companyData,
  };

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.hubapi.com/crm/v3/objects/companies',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
      data: JSON.stringify({ properties: updatedCompanyData }),
    });

    logger.info('HTTP Status:', response.status);

    if (response && response.data) {
      logger.success('HubSpot company has successfully been created');
      logger.info('Result:', response.data);

      return response.data;
    } else {
      logger.error('HubSpot company was not created');

      return null;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        logger.error(`Error while creating a company - Error: ${error.response}`);
      } else {
        logger.error(`Error while creating a company - Message: ${error.message}`);
      }
    } else {
      logger.error('An unexpected error occurred:', error);
    }

    return null;
  }
};

// eslint-disable-next-line
const updateCompany = async (hubToken: HubToken, companyId: string, companyData: any): Promise<CompanyDetail | null> => {
  logger.info(`Trying to update company`);

  delete companyData.legal_name;

  try {
    const response: AxiosResponse = await axios({
      method: 'patch',
      url: `https://api.hubapi.com/crm/v3/objects/company/${companyId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
      data: JSON.stringify({
        properties: companyData,
      }),
    });

    if (response && response.data) {
      logger.success('HubSpot company has successfully been updated');
      logger.info('Result:', response.data);

      return response.data;
    } else {
      logger.error('HubSpot company has not been updated');

      return null;
    }
  } catch (error) {
    logger.error('Error while updating company:', error);

    return null;
  }
};

const companiesController = {
  getCompanies,
  getCompanyInfo,
  updateCompany,
  createCompany,
  getCompany,
};

export default companiesController;
