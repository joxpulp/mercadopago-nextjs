export interface IConfig {
	style: {
		color: string;
		placeholderColor: string;
	};
	placeholder: {
		cardNumber?: string;
		expirationDate?: string;
		securityCode?: string;
	};
}

export interface IPaymentMethodInfo {
	brand: string;
	cardType: string;
}

export interface IErrorMessagesObject {
	invalid: boolean;
	message?: string;
}

export interface IFieldDataObject {
	error: IErrorMessagesObject;
	isFocus: boolean;
}

export interface IFieldData {
	cardNumber: IFieldDataObject;
	expirationDate: IFieldDataObject;
	securityCode: IFieldDataObject;
}

export interface IMPEventAttributes {
	field: 'cardNumber' | 'expirationDate' | 'securityCode';
	errorMessages: IErrorMessages[];
}

export interface IErrorMessagesDetails {
	reason: string;
	expected_type: string;
}
export interface ICardInfo {
	cardholderName: string;
	identificationType: string;
	identificationNumber: string;
}

export interface IErrorMessages {
	cause: string;
	message: string;
	field: string;
	details: IErrorMessagesDetails;
}

export interface IIdentificationTypes {
	id: string;
	name: string;
	type: string;
	min_length: number;
	max_length: number;
}


interface Identification {
	number: string;
	type: string;
}
interface Cardholder {
	identification: Identification;
	name: string;
}

export interface ICreateCardToken {
	id: string;
	public_key: string;
	first_six_digits: string;
	expiration_month: number;
	expiration_year: number;
	last_four_digits: string;
	cardholder: Cardholder;
	status: string;
	date_created: Date;
	date_last_updated: Date;
	date_due: Date;
	luhn_validation: boolean;
	live_mode: boolean;
	require_esc: boolean;
	card_number_length: number;
	security_code_length: number;
}