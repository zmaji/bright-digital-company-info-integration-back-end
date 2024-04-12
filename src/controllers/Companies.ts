import type { Company } from '../typings/Company';
import type { CompanyDetail } from '../typings/CompanyDetail';

import axios, { AxiosResponse } from 'axios';
import * as soap from 'soap';
import logger from '../utils/Logger';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';
import { HubToken } from '@prisma/client';

const COMPANY_INFO_TEST_USERNAME = process.env.COMPANY_INFO_TEST_USERNAME;
const COMPANY_INFO_TEST_PASSWORD = process.env.COMPANY_INFO_TEST_PASSWORD;

const companyInfoURL = 'https://ws1.webservices.nl/soap_doclit?wsdl';
const headerArguments = { username: COMPANY_INFO_TEST_USERNAME, password: COMPANY_INFO_TEST_PASSWORD };

const getCompanies = async (tradeName: string): Promise<Company[] | null> => {
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
      logger.info(`Successfully found companies with trade name ${tradeName}`);

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

const getCompanyInfo = async (dossierNumber: number): Promise<CompanyDetail | null> => {
  try {
    const client = await soap.createClientAsync(companyInfoURL);
    const soapHeader = {
      'HeaderLogin': headerArguments,
    };

    client.addSoapHeader(soapHeader);

    const searchParameters = {
      dossier_number: dossierNumber,
    };

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
      logger.info(`Successfully found company with dossier number ${dossierNumber}`);

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

// eslint-disable-next-line
const updateCompany = async (hubToken: HubToken, companyId: string, companyData: CompanyDetail): Promise<CompanyDetail | null> => {
  logger.info(`Trying to update company`);
  const properties = await formatCompanyData(companyData);

  try {
    const response: AxiosResponse = await axios({
      method: 'patch',
      url: `https://api.hubapi.com/crm/v3/objects/company/${companyId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hubToken.access_token}`,
      },
      data: JSON.stringify({
        properties: properties,
      }),
    });

    if (response && response.data) {
      logger.info('HubSpot company has successfully been updated');
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
};

export default companiesController;
