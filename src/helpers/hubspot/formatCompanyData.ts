import { CompanyDetail } from '../../typings/CompanyDetail';

export const formatCompanyData = async (companyData: CompanyDetail) => {
  const formatAddress = (address: any) => {
    if (address && address.official) {
      return `${address.official.street || ''} ${address.official.house_number || ''}${address.official.house_number_addition || ''} ${address.official.postcode || ''} ${address.official.city || ''} ${address.official.country || ''}`;
    }

    return '';
  };

  return {
    dossier_number: companyData.dossier_number ? companyData.dossier_number : '',
    establishment_number: companyData.establishment_number ? companyData.establishment_number : '',
    number_of_establishments: companyData.structure && companyData.structure.number_of_subsidiaries ? companyData.structure.number_of_subsidiaries : '',
    main_establishment_number: companyData.structure && companyData.structure.ultimate_parent ? companyData.structure.ultimate_parent : '',
    main_establishment_number_direct: companyData.structure && companyData.structure.parent ? companyData.structure.parent : '',
    rsin_number: companyData.rsin_number ? companyData.rsin_number : '',
    indication_bankruptcy: companyData.indication_bankruptcy ? companyData.indication_bankruptcy : '',
    indication_insolvency: companyData.indication_insolvency ? companyData.indication_insolvency : '',
    indication_insolvency_number_description_date: companyData.indication_insolvency_number_description_date ? companyData.indication_insolvency_number_description_date : '',
    legal_name: companyData.legal_name ? companyData.legal_name : '',
    legal_form_code: companyData.legal_form_code ? companyData.legal_form_code : '',
    indication_organisation_code: companyData.indication_organisation_code ? companyData.indication_organisation_code : '',
    ws_indication_economically_active: companyData.ws_indication_economically_active ? companyData.ws_indication_economically_active : '',
    establishment_date: companyData.establishment_date ? companyData.establishment_date : '',
    founding_date: companyData.founding_date ? companyData.founding_date : '',
    discontinuation_date: companyData.discontinuation_date ? companyData.discontinuation_date : '',
    continuation_date: companyData.continuation_date ? companyData.continuation_date : '',
    founder: companyData.founder ? companyData.founder : '',
    street: companyData.street ? companyData.street : '',
    house_number_and_addition: companyData.house_number_and_addition ? companyData.house_number_and_addition : '',
    postal_code: companyData.postal_code ? companyData.postal_code : '',
    city_country: companyData.city_country ? companyData.city_country : '',
    trade_name_full: companyData.trade_name_full ? companyData.trade_name_full : '',
    trade_name: companyData.trade_name_45 ? companyData.trade_name_45 : '',
    establishment_address: formatAddress(companyData.establishment_address),
    postalcode_establishment_address: companyData.establishment_address && companyData.establishment_address.formatted && companyData.establishment_address.formatted.postcode ? companyData.establishment_address.formatted.postcode : '',
    city_establishment_address: companyData.establishment_address && companyData.establishment_address.official && companyData.establishment_address.official.city ? companyData.establishment_address.official.city : '',
    street_establishment_address: companyData.establishment_address && companyData.establishment_address.formatted && companyData.establishment_address.formatted.street ? `${companyData.establishment_address.formatted.street}` : '',
    house_number_establishment_address: companyData.establishment_address && companyData.establishment_address.formatted && companyData.establishment_address.formatted.street ? `${companyData.establishment_address.formatted.house_number ? companyData.establishment_address.formatted.house_number : ''}` : '',
    house_number_addition_establishment_address: companyData.establishment_address && companyData.establishment_address.formatted && companyData.establishment_address.formatted.street ? `${companyData.establishment_address.formatted.house_number_addition ? companyData.establishment_address.formatted.house_number_addition : ''}` : '',
    country_establishment_address: companyData.establishment_address && companyData.establishment_address.official && companyData.establishment_address.official.country ? companyData.establishment_address.official.country : '',

    correspondence_address: formatAddress(companyData.correspondence_address),
    postalcode_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.postcode ? companyData.correspondence_address.official.postcode : '',
    city_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.city ? companyData.correspondence_address.official.city : '',
    street_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.street ? companyData.correspondence_address.official.street : '',
    house_number_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.house_number ? companyData.correspondence_address.official.house_number : '',
    house_number_addition_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.house_number_addition ? companyData.correspondence_address.official.house_number_addition : '',
    country_correspondence_address: companyData.correspondence_address && companyData.correspondence_address.official && companyData.correspondence_address.official.country ? companyData.correspondence_address.official.country : '',

    telephone_number: companyData.telephone_number ? companyData.telephone_number : '',
    mobile_number: companyData.mobile_number ? companyData.mobile_number : '',
    domain_name: companyData.domain_name ? companyData.domain_name : '',
    sbi_code_description: companyData.sbi_code_description ? companyData.sbi_code_description : '',
    primary_sbi_code: companyData.primary_sbi_code ? companyData.primary_sbi_code : '',
    primary_sbi_code_text: companyData.primary_sbi_code_text ? companyData.primary_sbi_code_text : '',
    secondary_sbi_code1: companyData.secondary_sbi_code1 ? companyData.secondary_sbi_code1 : '',
    secondary_sbi_code1_text: companyData.secondary_sbi_code1_text ? companyData.secondary_sbi_code1_text : '',
    secondary_sbi_code2: companyData.secondary_sbi_code2 ? companyData.secondary_sbi_code2 : '',
    secondary_sbi_code2_text: companyData.secondary_sbi_code2_text ? companyData.secondary_sbi_code2_text : '',

    industry_companyinfo: companyData.industry_companyinfo ? companyData.industry_companyinfo : '',
    personnel_kvk: companyData.personnel ? companyData.personnel : '',
    personnel_annual_reports: companyData.personnel_annual_reports ? companyData.personnel_annual_reports : '',
    authorized_share_capital: companyData.authorized_share_capital ? companyData.authorized_share_capital : '',
    authorized_share_capital_currency: companyData.authorized_share_capital_currency ? companyData.authorized_share_capital_currency : '',
    paid_up_share_capital: companyData.paid_up_share_capital ? companyData.paid_up_share_capital : '',
    paid_up_share_capital_currency: companyData.paid_up_share_capital_currency ? companyData.paid_up_share_capital_currency : '',
    issued_share_capital: companyData.issued_share_capital ? companyData.issued_share_capital : '',
    issued_share_capital_currency: companyData.issued_share_capital_currency ? companyData.issued_share_capital_currency : '',
    revenue: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.turnover && companyData.annual_financial_statement_summary.turnover.amount ? companyData.annual_financial_statement_summary.turnover.amount : '',
    profit: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.profit && companyData.annual_financial_statement_summary.profit.amount ? companyData.annual_financial_statement_summary.profit.amount : '',
    assets: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.assets && companyData.annual_financial_statement_summary.assets.amount ? companyData.annual_financial_statement_summary.assets.amount : '',
    revenue_currency: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.turnover && companyData.annual_financial_statement_summary.turnover.currency ? companyData.annual_financial_statement_summary.turnover.currency : '',
    profit_currency: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.profit && companyData.annual_financial_statement_summary.profit.currency ? companyData.annual_financial_statement_summary.profit.currency : '',
    assets_currency: companyData.annual_financial_statement_summary && companyData.annual_financial_statement_summary.assets && companyData.annual_financial_statement_summary.assets.currency ? companyData.annual_financial_statement_summary.assets.currency : '',
  };
};
