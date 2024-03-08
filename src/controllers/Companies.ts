import type { Company } from '../typings/Company';
import type { CompanyDetail } from '../typings/CompanyDetail';

import axios, { AxiosResponse } from 'axios';
import * as soap from 'soap';
import logger from '../utils/Logger';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';

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

    // @ts-ignore
    const result: any = await client.dutchBusinessSearchParametersV2Async(searchParameters);

    if (result && result[0]?.out?.results) {
      logger.info(`Successfully found companies with trade name ${tradeName}`);

      return result[0].out.results as Company[];
    } else {
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

    // @ts-ignore
    const result: any = await new Promise((resolve: any, reject: any) => {
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

      return result.out as Company;
    } else {
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting company information', error);
    throw error;
  }
};

const updateCompany = async (companyId: string, companyData: CompanyDetail): Promise<Company | null> => {
  try {
    logger.info('Updating HubSpot company..');
    const hubSpotProperties = await formatCompanyData(companyData);

    if (hubSpotProperties) {
    // TODO: Type and fix hubspot env
      const response: AxiosResponse<any> = await axios.patch(`https://api.hubapi.com/crm/v3/objects/company/${companyId}`, hubSpotProperties, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`,
        },
      });

      // TODO: Type
      const result: any = response;

      if (result) {
        logger.info('HubSpot company has successfully been updated');
        return result;
      } else {
        logger.error('HubSpot company has not been updated');
        return null;
      }
    } else {
      logger.error('HubSpot company could not be updated');
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong updating a HubSpot company', error);
    throw error;
  }
};

const companiesController = {
  getCompanies,
  getCompanyInfo,
  updateCompany,
};

export default companiesController;
