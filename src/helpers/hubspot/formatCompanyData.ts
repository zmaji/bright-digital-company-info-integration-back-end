import type { PropertyField } from '../../typings/PropertyField';

import { PropertyOption } from '../../typings/PropertyOptions';

const generateOption = (label: string, value: string, displayOrder: number, hidden: boolean): PropertyOption => {
  return {
    label,
    value,
    displayOrder,
    hidden,
  };
};

const generateProperty = (label: string, name: string, type: string, fieldType: string, groupName: string, hidden: boolean, displayOrder: number, formField: boolean, options?: PropertyOption[]): PropertyField => {
  const property: PropertyField = {
    label,
    name,
    type,
    fieldType,
    groupName,
    hidden,
    displayOrder,
    hasUniqueValue: false,
    formField,
  };

  if (options) {
    property.options = options;
  }

  return property;
};

export const getHubSpotProperties = async (groupName: string): Promise<PropertyField[]> => {
  const properties: PropertyField[] = [
    generateProperty('KVK-nummer', 'dossier_number', 'number', 'number', groupName, false, 1, true),
    generateProperty('Vestigingsnummer', 'establishment_number', 'number', 'number', groupName, false, 2, true),
    generateProperty('Aantal vestigingen organisatie', 'number_of_establishments', 'number', 'number', groupName, false, 3, true),
    generateProperty('Moederonderneming KVK-nummer', 'main_establishment_number', 'number', 'number', groupName, false, 4, true),
    generateProperty('Directe moederonderneming KVK-nummer', 'main_establishment_number_direct', 'number', 'number', groupName, false, 5, true),
    generateProperty('RSIN-nummer', 'rsin_number', 'string', 'text', groupName, false, 6, true),
    generateProperty('Indicatie failliet', 'indication_bankruptcy', 'enumeration', 'radio', groupName, false, 7, true, [
      generateOption('True', 'true', 1, false),
      generateOption('False', 'false', 2, false),
    ]),
    generateProperty('Indicatie insolventie', 'indication_insolvency', 'enumeration', 'radio', groupName, false, 8, true, [
      generateOption('True', 'true', 1, false),
      generateOption('False', 'false', 2, false),
    ]),
    generateProperty('Insolventienr, beschrijving en datum', 'indication_insolvency_number_description_date', 'string', 'textarea', groupName, false, 9, true),
    generateProperty('Rechtsvorm', 'legal_name', 'enumeration', 'select', groupName, false, 10, true, [
      generateOption('eenmanszaak', 'eenmanszaak', 1, false),
      generateOption('maatschap', 'maatschap', 2, false),
      generateOption('vennootschap onder firma (vof)', 'vennootschap onder firma (vof)', 3, false),
      generateOption('commanditaire vennootschap (cv)', 'commanditaire vennootschap (cv)', 4, false),
      generateOption('besloten vennootschap (bv)', 'besloten vennootschap (bv)', 5, false),
      generateOption('naamloze vennootschap (nv)', 'naamloze vennootschap (nv)', 6, false),
      generateOption('stichting', 'stichting', 7, false),
      generateOption('vereniging', 'vereniging', 8, false),
      generateOption('coöperatie', 'coöperatie', 9, false),
    ]),
    generateProperty('Rechtsvorm code', 'legal_form_code', 'number', 'number', groupName, false, 11, true),
    generateProperty('Organisatie code', 'indication_organisation_code', 'string', 'text', groupName, false, 12, true),
    generateProperty('Indicatie ingeschreven', 'ws_indication_economically_active', 'enumeration', 'radio', groupName, false, 13, true, [
      generateOption('True', 'true', 1, false),
      generateOption('False', 'false', 2, false),
    ]),
    generateProperty('Datum registratie', 'establishment_date', 'date', 'date', groupName, false, 14, true),
    generateProperty('Datum oprichting', 'founding_date', 'date', 'date', groupName, false, 15, true),
    generateProperty('Datum uitschrijving', 'discontinuation_date', 'date', 'date', groupName, false, 16, true),
    generateProperty('Datum doorstart', 'continuation_date', 'date', 'date', groupName, false, 17, true),
    generateProperty('1e bestuurder', 'founder', 'string', 'text', groupName, false, 18, true),
    generateProperty('Straatnaam', 'street', 'string', 'text', groupName, false, 19, true),
    generateProperty('Huisnummer en toevoeging', 'house_number_and_addition', 'string', 'text', groupName, false, 20, true),
    generateProperty('Postcode', 'postal_code', 'string', 'text', groupName, false, 21, true),
    generateProperty('Plaatsnaam en land', 'city_country', 'string', 'text', groupName, false, 22, true),
    generateProperty('Statutaire naam', 'trade_name_full', 'string', 'text', groupName, false, 23, true),
    generateProperty('Huidige handelsnaam', 'trade_name', 'string', 'text', groupName, false, 24, true),
    generateProperty('Vestigingsadres', 'establishment_address', 'string', 'textarea', groupName, false, 25, true),
    generateProperty('Postcode vestigingsadres', 'postalcode_establishment_address', 'string', 'text', groupName, false, 26, true),
    generateProperty('Stad vestigingsadres', 'city_establishment_address', 'string', 'text', groupName, false, 27, true),
    generateProperty('Straatnaam vestigingsadres', 'street_establishment_address', 'string', 'text', groupName, false, 28, true),
    generateProperty('Huisnummer vestigingsadres', 'house_number_establishment_address', 'number', 'number', groupName, false, 29, true),
    generateProperty('Toevoeging huisnummer vestigingsadres', 'house_number_addition_establishment_address', 'string', 'text', groupName, false, 30, true),
    generateProperty('Land vestigingsadres', 'country_establishment_address', 'string', 'text', groupName, false, 31, true),
    generateProperty('Correspondentieadres', 'correspondence_address', 'string', 'textarea', groupName, false, 32, true),
    generateProperty('Postcode correspondentieadres', 'postalcode_correspondence_address', 'string', 'text', groupName, false, 33, true),
    generateProperty('Stad correspondentieadres', 'city_correspondence_address', 'string', 'text', groupName, false, 34, true),
    generateProperty('Straatnaam correspondentieadres', 'street_correspondence_address', 'string', 'text', groupName, false, 35, true),
    generateProperty('Huisnummer correspondentieadres', 'house_number_correspondence_address', 'number', 'number', groupName, false, 36, true),
    generateProperty('Toevoeging huisnummer correspondentieadres', 'house_number_addition_correspondence_address', 'string', 'text', groupName, false, 37, true),
    generateProperty('Land correspondentieadres', 'country_correspondence_address', 'string', 'text', groupName, false, 38, true),
    generateProperty('Postbusnummer', 'postbox_number', 'number', 'number', groupName, false, 39, true),
    generateProperty('Postcode postbusnummer', 'postalcode_postbox_number', 'string', 'text', groupName, false, 40, true),
    generateProperty('Stad postbusnummer', 'city_postbox_number', 'string', 'text', groupName, false, 41, true),
    generateProperty('Straatnaam postbusnummer', 'street_postbox_number', 'string', 'text', groupName, false, 42, true),
    generateProperty('Huisnummer postbusnummer', 'house_number_postbox_number', 'number', 'number', groupName, false, 43, true),
    generateProperty('Toevoeging huisnummer postbusnummer', 'house_number_addition_postbox_number', 'string', 'text', groupName, false, 44, true),
    generateProperty('Land postbusnummer', 'country_postbox_number', 'string', 'text', groupName, false, 45, true),
    generateProperty('Telefoonnummer algemeen', 'general_phone_number', 'string', 'text', groupName, false, 46, true),
    generateProperty('Faxnummer algemeen', 'general_fax_number', 'string', 'text', groupName, false, 47, true),
    generateProperty('Telefoonnummer vestiging', 'establishment_phone_number', 'string', 'text', groupName, false, 48, true),
    generateProperty('Faxnummer vestiging', 'establishment_fax_number', 'string', 'text', groupName, false, 49, true),
    generateProperty('E-mailadres algemeen', 'general_email_address', 'string', 'email', groupName, false, 50, true),
    generateProperty('Website', 'website', 'string', 'url', groupName, false, 51, true),
    generateProperty('Valuta balans', 'balance_currency', 'string', 'text', groupName, false, 52, true),
    generateProperty('Balans', 'balance', 'number', 'number', groupName, false, 53, true),
    generateProperty('Valuta eigen vermogen', 'equity_currency', 'string', 'text', groupName, false, 54, true),
    generateProperty('Eigen vermogen', 'equity', 'number', 'number', groupName, false, 55, true),
    generateProperty('Valuta schuld', 'debt_currency', 'string', 'text', groupName, false, 56, true),
    generateProperty('Schuld', 'debt', 'number', 'number', groupName, false, 57, true),
    generateProperty('Valuta omzet', 'revenue_currency', 'string', 'text', groupName, false, 58, true),
    generateProperty('Omzet', 'revenue', 'number', 'number', groupName, false, 59, true),
    generateProperty('Valuta bedrijfsresultaat', 'business_result_currency', 'string', 'text', groupName, false, 60, true),
    generateProperty('Bedrijfsresultaat', 'business_result', 'number', 'number', groupName, false, 61, true),
    generateProperty('Valuta winst', 'profit_currency', 'string', 'text', groupName, false, 62, true),
    generateProperty('Activa', 'assets', 'number', 'number', groupName, false, 63, true),
    generateProperty('Valuta activa', 'assets_currency', 'string', 'text', groupName, false, 64, true),
  ];

  return properties;
};
