// import type { Company } from '../typings/User';
import axios, { AxiosResponse } from 'axios';
import * as soap from 'soap';

import logger from '../utils/Logger';
import { formatCompanyData } from '../helpers/hubspot/formatCompanyData';

const COMPANY_INFO_TEST_USERNAME = process.env.COMPANY_INFO_TEST_USERNAME;
const COMPANY_INFO_TEST_PASSWORD = process.env.COMPANY_INFO_TEST_PASSWORD;

const companyInfoURL = 'https://ws1.webservices.nl/soap_doclit?wsdl';
const headerArguments = { username: COMPANY_INFO_TEST_USERNAME, password: COMPANY_INFO_TEST_PASSWORD };

// TODO: fix type
const getCompany = async (tradeName: string): Promise<any> => {
  try {
    const client = await soap.createClientAsync(companyInfoURL);
    const soapHeader = {
      "HeaderLogin": headerArguments
    };
    
    client.addSoapHeader(soapHeader);

    const searchParameters = {
      trade_name: tradeName
    };

    // TODO: fix type
    const result: any = await client.dutchBusinessSearchParametersV2Async(searchParameters);

    logger.info('result');
    logger.info(result.out.results);

    if (result.out.results) {
      logger.info('Successfully found ......');
      return result.out.results;
    } else {
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting a company', error);
    throw error;
  }
};

// TODO: fix type
const getCompanyInfo = async (dossierNumber: string): Promise<any> => {
  try {
    const client = await soap.createClientAsync(companyInfoURL);
    const soapHeader = {
      "HeaderLogin": headerArguments
    };
    
    client.addSoapHeader(soapHeader);

    const searchParameters = {
      dossier_number: dossierNumber
    };

    // TODO: fix type
    const result: any = await client.dutchBusinessGetDossierV3(searchParameters);

    logger.info('result');
    logger.info(result);

    if (result.out) {
      logger.info('Successfully found ......');
      return result.out.results;
    } else {
      return null;
    }
  } catch (error) {
    logger.error('Something went wrong getting information', error);
    throw error;
  }
};

// TODO: fix type
const updateCompany = async (companyId: any, companyData: any): Promise<any> => {
  try {
    logger.info('Updating HubSpot company..');
    const hubSpotProperties = await formatCompanyData(companyData);

    if (hubSpotProperties) {
    // TODO: Type and fix hubspot env
    const response: AxiosResponse<any> = await axios.patch(`https://api.hubapi.com/crm/v3/objects/company/${companyId}`, companyData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`
      },
    });

    // TODO: Type
    const result: any = response

    if (result) {
      logger.info('HubSpot company has successfully been updated');
      return result;
    } else {
      logger.error('HubSpot company has not been updated');
      return null;
    }
    } else {
      logger.error('HubSpot properties could not be formatted');
      return null;
    }

  } catch (error) {
    logger.error('Something went wrong updating a HubSpot company', error);
    throw error;
  }
};


const companiesController = {
  getCompany,
  getCompanyInfo,
  updateCompany,
};

export default companiesController;
