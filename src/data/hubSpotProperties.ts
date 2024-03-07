export const hubSpotProperties = [
      {
        "label": "KVK-nummer",
        "name": "dossier_number",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 1,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Vestigingsnummer",
        "name": "establishment_number",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 2,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Aantal vestigingen organisatie",
        "name": "number_of_establishments",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 3,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Moederonderneming KVK-nummer",
        "name": "main_establishment_number",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 4,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Directe moederonderneming KVK-nummer",
        "name": "main_establishment_number_direct",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 5,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "RSIN-nummer",
        "name": "rsin_number",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 6,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Indicatie failliet",
        "name": "indication_bankruptcy",
        "type": "enumeration",
        "fieldType": "radio",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 7,
        "hasUniqueValue": false,
        "formField": true,
        "options": [
          {
            "label": "True",
            "value": "true",
            "displayOrder": 1,
            "hidden": false
          },
          {
            "label": "False",
            "value": "false",
            "displayOrder": 2,
            "hidden": false
          }
        ]
      },
      {
        "label": "Indicatie insolventie",
        "name": "indication_insolvency",
        "type": "enumeration",
        "fieldType": "radio",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 8,
        "hasUniqueValue": false,
        "formField": true,
        "options": [
          {
            "label": "True",
            "value": "true",
            "displayOrder": 1,
            "hidden": false
          },
          {
            "label": "False",
            "value": "false",
            "displayOrder": 2,
            "hidden": false
          }
        ]
      },
      {
        "label": "Insolventienr, beschrijving en datum",
        "name": "indication_insolvency_number_description_date",
        "type": "string",
        "fieldType": "textarea",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 9,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Rechtsvorm",
        "name": "legal_name",
        "type": "enumeration",
        "fieldType": "select",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 10,
        "hasUniqueValue": false,
        "formField": true,
        "options": [
          {
            "label": "eenmanszaak",
            "value": "eenmanszaak",
            "displayOrder": 1,
            "hidden": false
          },
          {
            "label": "maatschap",
            "value": "maatschap",
            "displayOrder": 2,
            "hidden": false
          },
          {
            "label": "vennootschap onder firma (vof)",
            "value": "vennootschap onder firma (vof)",
            "displayOrder": 3,
            "hidden": false
          },
          {
            "label": "commanditaire vennootschap (cv)",
            "value": "commanditaire vennootschap (cv)",
            "displayOrder": 4,
            "hidden": false
          },
          {
            "label": "besloten vennootschap (bv)",
            "value": "besloten vennootschap (bv)",
            "displayOrder": 5,
            "hidden": false
          },
          {
            "label": "naamloze vennootschap (nv)",
            "value": "naamloze vennootschap (nv)",
            "displayOrder": 6,
            "hidden": false
          },
          {
            "label": "stichting",
            "value": "stichting",
            "displayOrder": 7,
            "hidden": false
          },
          {
            "label": "vereniging",
            "value": "vereniging",
            "displayOrder": 8,
            "hidden": false
          },
          {
            "label": "coöperatie",
            "value": "coöperatie",
            "displayOrder": 9,
            "hidden": false
          }
        ]
      },
      {
        "label": "Rechtsvorm code",
        "name": "legal_form_code",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 11,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Organisatie code",
        "name": "indication_organisation_code",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 12,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Indicatie ingeschreven",
        "name": "ws_indication_economically_active",
        "type": "enumeration",
        "fieldType": "radio",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 13,
        "hasUniqueValue": false,
        "formField": true,
        "options": [
          {
            "label": "True",
            "value": "true",
            "displayOrder": 1,
            "hidden": false
          },
          {
            "label": "False",
            "value": "false",
            "displayOrder": 2,
            "hidden": false
          }
        ]
      },
      {
        "label": "Datum registratie",
        "name": "establishment_date",
        "type": "date",
        "fieldType": "date",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 14,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Datum oprichting",
        "name": "founding_date",
        "type": "date",
        "fieldType": "date",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 15,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Datum uitschrijving",
        "name": "discontinuation_date",
        "type": "date",
        "fieldType": "date",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 16,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Datum doorstart",
        "name": "continuation_date",
        "type": "date",
        "fieldType": "date",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 17,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "1e bestuurder",
        "name": "founder",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 18,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Straatnaam",
        "name": "street",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 19,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Huisnummer en toevoeging",
        "name": "house_number_and_addition",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 20,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Postcode",
        "name": "postal_code",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 21,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Plaatsnaam en land",
        "name": "city_country",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 22,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Statutaire naam",
        "name": "trade_name_full",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 23,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Huidige handelsnaam",
        "name": "trade_name",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 24,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Vestigingsadres",
        "name": "establishment_address",
        "type": "string",
        "fieldType": "textarea",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 25,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Postcode vestigingsadres",
        "name": "postalcode_establishment_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 26,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Stad vestigingsadres",
        "name": "city_establishment_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 27,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Straatnaam vestigingsadres",
        "name": "street_establishment_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 28,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Huisnummer vestigingsadres",
        "name": "house_number_establishment_address",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 29,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Toevoeging huisnummer vestigingsadres",
        "name": "house_number_addition_establishment_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 30,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Land vestigingsadres",
        "name": "country_establishment_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 31,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Correspondentieadres",
        "name": "correspondence_address",
        "type": "string",
        "fieldType": "textarea",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 32,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Postcode correspondentieadres",
        "name": "postalcode_correspondence_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 33,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Stad correspondentieadres",
        "name": "city_correspondence_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 34,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Straatnaam correspondentieadres",
        "name": "street_correspondence_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 35,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Huisnummer correspondentieadres",
        "name": "house_number_correspondence_address",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 36,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Toevoeging huisnummer correspondentieadres",
        "name": "house_number_addition_correspondence_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 37,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Land correspondentieadres",
        "name": "country_correspondence_address",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 38,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Telefoonnummer",
        "name": "telephone_number",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 39,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Mobiel nummer",
        "name": "mobile_number",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 40,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Website",
        "name": "domain_name",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 41,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Branche SBI en omschrijving",
        "name": "sbi_code_description",
        "type": "string",
        "fieldType": "textarea",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 42,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Primary SBI-code",
        "name": "primary_sbi_code",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 43,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Secondary SBI-code 1",
        "name": "secondary_sbi_code_1",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 44,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Secondary SBI-code 2",
        "name": "secondary_sbi_code2",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 45,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Primary SBI-code text",
        "name": "primary_sbi_code_text",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 46,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Secondary SBI-code 1 text",
        "name": "secondary_sbi_code1_text",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 47,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Secondary SBI-code 2 text",
        "name": "secondary_sbi_code2_text",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 48,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Branche volgens company.info",
        "name": "industry_companyinfo",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 49,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Branche volgens company.info",
        "name": "industry_companyinfo",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 50,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Aantal werkzame personen, bron: kvk",
        "name": "personnel_kvk",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 51,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Aantal werkzame personen, bron: jaarverslagen",
        "name": "personnel_annual_reports",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 52,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Maatschappelijk kapitaal",
        "name": "authorized_share_capital",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 53,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta maatschappelijk kapitaal",
        "name": "authorized_share_capital_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 54,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Gestort kapitaal",
        "name": "paid_up_share_capital",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 55,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta gestort kapitaal",
        "name": "paid_up_share_capital_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 56,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Geplaatst kapitaal",
        "name": "issued_share_capital",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 57,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta geplaatst kapitaal",
        "name": "issued_share_capital_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 58,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Omzet",
        "name": "revenue",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 59,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta omzet",
        "name": "revenue_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 60,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Winst",
        "name": "profit",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 61,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta winst",
        "name": "profit_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 62,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Activa",
        "name": "assets",
        "type": "number",
        "fieldType": "number",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 63,
        "hasUniqueValue": false,
        "formField": true
      },
      {
        "label": "Valuta activa",
        "name": "assets_currency",
        "type": "string",
        "fieldType": "text",
        "groupName": "company_info_plugin",
        "hidden": false,
        "displayOrder": 64,
        "hasUniqueValue": false,
        "formField": true,
      }
    ]