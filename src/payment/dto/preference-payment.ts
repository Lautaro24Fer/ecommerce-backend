// Petición

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, Validate, ValidateNested } from "class-validator";


// Convertir interfaces a clases

export class UnitPriceReqDto {
    @ApiProperty({ example: '032' })
    @IsString() // Validación para cadenas de texto
    currency: string;

    @ApiProperty({ example: 100.5 })
    @IsNumber() // Validación para números
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
    @IsArray() // Validación para arrays
    @ValidateNested({ each: true }) // Validar cada elemento del array como objeto anidado
    @Type(() => ItemReqDto) // Necesario para arrays de objetos
    items: ItemReqDto[];
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

