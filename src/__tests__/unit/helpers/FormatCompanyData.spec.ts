import { formatCompanyData } from '../../../helpers/hubspot/formatCompanyData';

describe('formatCompanyData Function Tests', () => {
  test('should format company data correctly', async () => {
    const companyData = {
      dossier_number: '12345',
      establishment_number: '67890',
      structure: {
        number_of_subsidiaries: 5,
        ultimate_parent: '111',
        parent: '222',
      },
      rsin_number: 'RSIN123',
      indication_bankruptcy: 'No',
      indication_insolvency: 'No',
      legal_name: 'Company Name',
      legal_form_code: '123',
      establishment_date: {
        year: 2022,
        month: 4,
        day: 1,
      },
      founding_date: {
        year: 2020,
        month: 1,
        day: 15,
      },
      discontinuation_date: {
        year: 2023,
        month: 12,
        day: 31,
      },
      continuation_date: {
        year: 2023,
        month: 12,
        day: 31,
      },
      founder: 'Founder Name',
      street: 'Main Street',
      house_number_and_addition: '123A',
      postal_code: '12345',
      city_country: 'City, Country',
      trade_name_full: 'Full Trade Name',
      trade_name_45: 'Trade Name',
      establishment_address: {
        official: {
          street: 'Main Street',
          house_number: '123',
          house_number_addition: 'A',
          postcode: '12345',
          city: 'City',
          country: 'Country',
        },
        formatted: {
          street: 'Main Street',
          house_number: '123',
          house_number_addition: 'A',
          postcode: '12345',
          city: 'City',
          country: 'Country',
        },
      },
      correspondence_address: {
        official: {
          street: 'Correspondence Street',
          house_number: '456',
          house_number_addition: 'B',
          postcode: '54321',
          city: 'Correspondence City',
          country: 'Correspondence Country',
        },
        formatted: {
          street: 'Correspondence Street',
          house_number: '456',
          house_number_addition: 'B',
          postcode: '54321',
          city: 'Correspondence City',
          country: 'Correspondence Country',
        },
      },
      telephone_number: '123-456-7890',
      mobile_number: '987-654-3210',
      domain_name: 'example.com',
      sbi_code_description: 'SBI Code Description',
      primary_sbi_code: '456',
      primary_sbi_code_text: 'Primary SBI Code',
      secondary_sbi_code2: 'Secondary SBI Code',
      industry_companyinfo: 'Industry Info',
      personnel: '100',
      personnel_annual_reports: '120',
      authorized_share_capital: 'Authorized Share Capital',
      authorized_share_capital_currency: 'USD',
      paid_up_share_capital: 'Paid Up Share Capital',
      paid_up_share_capital_currency: 'USD',
      issued_share_capital: 'Issued Share Capital',
      issued_share_capital_currency: 'USD',
      annual_financial_statement_summary: {
        turnover: {
          amount: '500000',
          currency: 'USD',
        },
        profit: {
          amount: '100000',
          currency: 'USD',
        },
        assets: {
          amount: '2000000',
          currency: 'USD',
        },
      },
      last_sync: "",
    };

    const formattedData = await formatCompanyData(companyData);

    expect(formattedData).toEqual({
      dossier_number: 12345,
      establishment_number: 67890,
      number_of_establishments: 5,
      main_establishment_number: 111,
      main_establishment_number_direct: 222,
      rsin_number: 'RSIN123',
      indication_bankruptcy: 'No',
      indication_insolvency: 'No',
      indication_insolvency_number_description_date: '',
      legal_name: 'Company Name',
      legal_form_code: 123,
      indication_organisation_code: '',
      ws_indication_economically_active: '',
      establishment_date: '2022-04-01',
      founding_date: '2020-01-15',
      discontinuation_date: '2023-12-31',
      continuation_date: '2023-12-31',
      founder: 'Founder Name',
      street: 'Main Street',
      house_number_and_addition: '123A',
      postal_code: '12345',
      city_country: 'City, Country',
      trade_name_full: 'Full Trade Name',
      trade_name: 'Trade Name',
      establishment_address: 'Main Street 123A 12345 City',
      postalcode_establishment_address: '12345',
      city_establishment_address: 'City',
      street_establishment_address: 'Main Street',
      house_number_establishment_address: '123',
      house_number_addition_establishment_address: 'A',
      country_establishment_address: 'Country',
      correspondence_address: 'Correspondence Street 456B 54321 Correspondence City',
      postalcode_correspondence_address: '54321',
      city_correspondence_address: 'Correspondence City',
      street_correspondence_address: 'Correspondence Street',
      house_number_correspondence_address: 456,
      house_number_addition_correspondence_address: 'B',
      country_correspondence_address: 'Correspondence Country',
      telephone_number: '123-456-7890',
      mobile_number: '987-654-3210',
      domain_name: 'example.com',
      sbi_code_description: 'SBI Code Description',
      primary_sbi_code: 456,
      primary_sbi_code_text: 'Primary SBI Code',
      secondary_sbi_code2: 'Secondary SBI Code',
      industry_companyinfo: 'Industry Info',
      personnel_kvk: 100,
      personnel_annual_reports: 120,
      authorized_share_capital: 'Authorized Share Capital',
      authorized_share_capital_currency: 'USD',
      paid_up_share_capital: 'Paid Up Share Capital',
      paid_up_share_capital_currency: 'USD',
      issued_share_capital: 'Issued Share Capital',
      issued_share_capital_currency: 'USD',
      revenue: '500000',
      profit: '100000',
      assets: '2000000',
      revenue_currency: 'USD',
      profit_currency: 'USD',
      last_sync: "",
    });
  });
});
