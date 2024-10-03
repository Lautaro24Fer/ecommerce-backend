// Petición

export interface IPaymentPreferenceRequest {
    data: DataRequest;
}

export interface DataRequest {
    attributes: AttributesReq;
}

export interface AttributesReq {
    currency: string; // "032" es AR$
    items:    ItemReq[];
}

export interface ItemReq {
    id:        number;
    name:      string;
    unitPrice: UnitPriceReq;
    quantity:  number;
}

export interface UnitPriceReq {
    currency: string;
    amount:   number;
}

// Respuesta

export interface IPaymentPreferenceResponse {
    data: DataResponse;
}

export interface DataResponse {
    id:         string;
    type:       string;
    attributes: AttributesRes;
    links:      LinkRes[];
}

export interface AttributesRes {
    uuid:              string;
    source:            string;
    appId:             string;
    paymentLimits:     number;
    orderNumber:       string;
    price:             PriceRes;
    shipping:          null;
    items:             ItemRes[];
    status:            string;
    taxes:             any[];
    links:             LinkRes;
    hasPendingPayment: boolean;
    payment:           PaymentRes;
    payments:          PaymentRes[];
}

export interface ItemRes {
    name:      string;
    quantity:  number;
    unitPrice: PriceRes;
    itemId:    null;
}

export interface PriceRes {
    currency: string;
    amount:   number;
}

export interface LinkRes {
    checkout:     string;
    redirect_url: RedirectURLRes;
}

export interface RedirectURLRes {
    success: null;
    failed:  null;
}

export interface PaymentRes {
    id:                 number;
    authorization_code: string;
    reference_number:   string;
    status:             string;
}


export interface ITokenReq {
    token_type:    string;
    expires_in:    number;
    access_token:  string;
    refresh_token: string;
}

