// Payment preference respo



// Payment preference request

export interface IPaymentPreferenceReq {
    items: Item[];
}

// Preference payment

export interface IPaymentPreference {
    items:                Item[];
    payer:                Payer;
    back_urls:            BackUrls;
    auto_return:          string;
    payment_methods:      PaymentMethods;
    notification_url:     string;
    statement_descriptor: string;
    external_reference:   string;
    expires:              boolean;
    expiration_date_from: string;
    expiration_date_to:   string;
}

export interface BackUrls {
    success: string;
    failure: string;
    pending: string;
}

export interface Item {
    id:          string;
    title:       string;
    currency_id: string;
    picture_url?: string | null;
    description: string;
    category_id: string;
    quantity:    number;
    unit_price:  number;
}

export interface Payer {
    name:           string;
    surname:        string;
    email:          string;
    phone?:          Phone;
    identification: Identification;
    address:        Address;
}

export interface Address {
    street_name:   string;
    street_number: string;
    zip_code:      string;
}

export interface Identification {
    type:   string;
    number: string;
}

export interface Phone {
    area_code: string;
    number:    string;
}

export interface PaymentMethods {
    excluded_payment_methods: ExcludedPayment[];
    excluded_payment_types:   ExcludedPayment[];
    installments:             number;
}

export interface ExcludedPayment {
    id: string;
}
