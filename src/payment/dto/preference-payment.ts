// Petición

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNumber, IsPositive, IsString, Validate, ValidateNested } from "class-validator";


// Convertir interfaces a clases

export class UnitPriceReqDto {
    @ApiProperty({ example: '032' })
    @IsString() // Validación para cadenas de texto
    currency: string;

    @ApiProperty({ example: 100 })
    @IsNumber() // Validación para números
    @IsInt()
    @IsPositive()
    amount: number;
}

export class ItemReqDto {
    @ApiProperty({ example: 1 })
    @IsNumber() // Validación para números
    id: number;

    @ApiProperty({ example: 'Product name' })
    @IsString() // Validación para cadenas de texto
    name: string;

    @ApiProperty({ type: () => UnitPriceReqDto })
    @ValidateNested() // Validación de objetos anidados
    @Type(() => UnitPriceReqDto) // Necesario para que `class-transformer` sepa qué clase usar
    unitPrice: UnitPriceReqDto;

    @ApiProperty({ example: 2 })
    @IsNumber() // Validación para números
    quantity: number;
}

export class AttributesReqDto {
    @ApiProperty({ example: '032', description: 'Currency code, e.g. "032" for ARS (Argentine Peso)' })
    @IsString() // Validación para cadenas de texto
    currency: string;

    @ApiProperty({ type: () => [ItemReqDto] })
    @ValidateNested({ each: true }) // Validar cada elemento del array como objeto anidado
    @Type(() => ItemReqDto) // Necesario para arrays de objetos
    items: ItemReqDto[];
    redirect_urls: OrderStatusRedirectURL;
    webhookUrl: string | null;
}

export class DataRequestDto {
    @ApiProperty({ type: () => AttributesReqDto })  
    @ValidateNested() // Validación de objetos anidados
    @Type(() => AttributesReqDto) // Especifica la clase correcta
    attributes: AttributesReqDto;
}

export class PaymentPreferenceRequestDto {
    @ApiProperty({ type: () => DataRequestDto })
    @ValidateNested() // Validación de objetos anidados
    @Type(() => DataRequestDto) // Especifica la clase correcta
    data: DataRequestDto;
}  

// Response

export interface IPaymentPreferenceResponse {
    data: PaymentPreferenceResData;
}

export interface PaymentPreferenceResData {
    id:         string;
    type:       string;
    attributes: PaymentPreferenceResAttributes;
    links:      PaymentPreferenceResLink[];
}

export interface PaymentPreferenceResAttributes {
    uuid:                       string;
    accountId:                  number;
    subsidiaryId:               number;
    source:                     string;
    appId:                      string;
    paymentLimits:              number;
    orderNumber:                string;
    price:                      PaymentPreferenceResPrice;
    shipping:                   null;
    tip:                        null;
    items:                      PaymentPreferenceResItem[];
    status:                     string;
    taxes:                      any[];
    externalData:               PaymentPreferenceResExternalData;
    links:                      PaymentPreferenceResLink;
    hasPendingPayment:          boolean;
    payment:                    null;
    payments:                   null;
    store:                      null;
    billing:                    null;
    expireLimitMinutes:         number;
    failedPaymentQuantityLimit: number;
    webhookUrl:                 null;
    redirectOnSuccess:          string;
    redirectOnFailure:          string;
}

export interface PaymentPreferenceResExternalData {
    user_uuid:    string;
    checkout_url: string;
}

export interface PaymentPreferenceResItem {
    name:      string;
    quantity:  number;
    unitPrice: PaymentPreferenceResPrice;
    itemId:    null;
}

export interface PaymentPreferenceResPrice {
    currency: string;
    amount:   number;
}

export interface PaymentPreferenceResLink {
    checkout:     string;
    redirect_url: RedirectURL;
}

export interface RedirectURL {
    success: string;
    failed:  string;
}


// Estado de la orden

export interface IOrderStatus {
    data: OrderStatusData;
}

export interface OrderStatusData {
    id:         string;
    type:       string;
    attributes: OrderStatusAttributes;
    links:      OrderStatusLink[];
}

export interface OrderStatusAttributes {
    uuid:              string;
    source:            string;
    appId:             string;
    paymentLimits:     number;
    orderNumber:       string;
    price:             OrderStatusPrice;
    shipping:          null;
    items:             OrderStatusItem[];
    status:            string;
    taxes:             any[];
    links:             OrderStatusLink;
    hasPendingPayment: boolean;
    payment:           OrderStatusPayment;
    payments:          OrderStatusPayment[];
}

export interface OrderStatusItem {
    name:      string;
    quantity:  number;
    unitPrice: OrderStatusPrice;
    itemId:    null;
}

export interface OrderStatusPrice {
    currency: string;
    amount:   number;
}

export interface OrderStatusLink {
    checkout:     string;
    redirect_url: OrderStatusRedirectURL;
}

export interface OrderStatusRedirectURL {
    success: string | null;
    failed:  string | null;
}

export interface OrderStatusPayment {
    id:                 number;
    authorization_code: string;
    reference_number:   string;
    status:             string;
}


export interface ITokenReq {
    token_type:    string;
    expires_in:    number;
    access_token:  string;
}

