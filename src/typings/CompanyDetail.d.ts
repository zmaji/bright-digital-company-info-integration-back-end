export type CompanyDetail = {
    dossier_number?: string;
    establishment_number?: string;
    number_of_establishments?: string;
    main_establishment_number?: string;
    main_establishment_number_direct?: string;
    rsin_number?: string;
    indication_bankruptcy?: string;
    indication_insolvency?: string;
    indication_insolvency_number_description_date?: string;
    legal_name?: string;
    legal_form_code?: string;
    indication_organisation_code?: string;
    ws_indication_economically_active?: string;
    establishment_date?: string;
    founding_date?: string;
    discontinuation_date?: string;
    continuation_date?: string;
    founder?: string;
    street?: string;
    house_number_and_addition?: string;
    postal_code?: string;
    city_country?: string;
    trade_name_full?: string;
    trade_name?: string;
    establishment_address?: {
        formatted?: {
            street?: string;
            house_number?: string;
            house_number_addition?: string;
            postcode?: string;
            city?: string;
        };
        official?: {
            street?: string;
            house_number?: string;
            house_number_addition?: string;
            postcode?: string;
            city?: string;
            country?: string;
        };
    };
    postalcode_establishment_address?: string;
    city_establishment_address?: string;
    street_establishment_address?: string;
    house_number_establishment_address?: string;
    house_number_addition_establishment_address?: string;
    country_establishment_address?: string;
    correspondence_address?: {
        formatted?: {
            street?: string;
            house_number?: string;
            house_number_addition?: string;
            postcode?: string;
            city?: string;
        };
        official?: {
            street?: string;
            house_number?: string;
            house_number_addition?: string;
            postcode?: string;
            city?: string;
            country?: string;
        };
    };
    postalcode_correspondence_address?: string;
    city_correspondence_address?: string;
    street_correspondence_address?: string;
    house_number_correspondence_address?: string;
    house_number_addition_correspondence_address?: string;
    country_correspondence_address?: string;
    telephone_number?: string;
    mobile_number?: string;
    domain_name?: string;
    sbi_code_description?: string;
    primary_sbi_code?: string;
    primary_sbi_code_text?: string;
    secondary_sbi_code1?: string;
    secondary_sbi_code1_text?: string;
    secondary_sbi_code2?: string;
    secondary_sbi_code2_text?: string;
    industry_companyinfo?: string;
    personnel_kvk?: string;
    personnel_annual_reports?: string;
    personnel?: string;
    authorized_share_capital?: string;
    authorized_share_capital_currency?: string;
    paid_up_share_capital?: string;
    paid_up_share_capital_currency?: string;
    issued_share_capital?: string;
    issued_share_capital_currency?: string;
    revenue?: string;
    profit?: string;
    assets?: string;
    revenue_currency?: string;
    profit_currency?: string;
    assets_currency?: string;
    structure?: {
        number_of_subsidiaries?: string;
        ultimate_parent?: string;
        parent?: string;
    };
    trade_name_45?: string;
    annual_financial_statement_summary?: {
        turnover?: {
            amount?: string;
            currency?: string;
        };
        profit?: {
            amount?: string;
            currency?: string;
        };
        assets?: {
            amount?: string;
            currency?: string;
        };
    };
};
