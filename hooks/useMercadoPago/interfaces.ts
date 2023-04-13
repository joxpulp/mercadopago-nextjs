export interface IErrorMessagesDetails {
	reason: string;
	expectedType: string;
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
	minLength: number;
	maxLength: number;
}

export interface IPaymentMethodInfo {
	brand: string;
	paymentType: string;
}

export interface IErrorMessagesObject {
	invalid: boolean;
	error: string;
	type: string;
}

export interface IErrorMessagesState {
	[k: string]: IErrorMessagesObject;
}

export interface ICardInfo {
	cardholderName: string;
	identificationType: string;
	identificationNumber: string;
}

export interface IConfig {
	style: {
		color: string;
		placeholderColor: string;
		focusBorderColor: string;
		errorBorderColor: string;
	};
	placeholder: {
		cardNumber: string;
		expirationDate: string;
		securityCode: string;
	};
}
