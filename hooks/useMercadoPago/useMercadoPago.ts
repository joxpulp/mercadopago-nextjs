import { useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
	ICardInfo,
	IConfig,
	IErrorMessages,
	IErrorMessagesObject,
	IErrorMessagesState,
	IIdentificationTypes,
	IPaymentMethodInfo,
} from './interfaces';
import { getErrorMessage } from './util';

declare global {
	interface Window {
		MercadoPago: any;
	}
}

export const useMercadoPago = (publicKey: string, config: IConfig) => {
	const [mercadoPago, setMercadoPago] = useState<any>();
	const [idTypes, setIdTypes] = useState<IIdentificationTypes[]>();
	const [paymentMethodInfo, setPaymentMethodInfo] =
		useState<IPaymentMethodInfo>({
			brand: '',
			paymentType: '',
		});
	const [errorMessages, setErrorMessages] = useState<IErrorMessagesState>({
		cardNumber: { invalid: false } as IErrorMessagesObject,
		expirationDate: { invalid: false } as IErrorMessagesObject,
		securityCode: { invalid: false } as IErrorMessagesObject,
	});

	const createCardToken = async (cardInfo: ICardInfo) => {
		if (mercadoPago) {
			try {
				return await mercadoPago.fields.createCardToken({
					cardholderName: cardInfo.cardholderName,
					identificationType: cardInfo.identificationType,
					identificationNumber: cardInfo.identificationNumber,
				});
			} catch (error) {
				return error;
			}
		}
	};

	// Initialize MercadoPago SDK
	useEffect(() => {
		const loadSecureFields = async () => {
			await loadMercadoPago();
			setMercadoPago(new window.MercadoPago(publicKey));
		};
		loadSecureFields();
	}, [publicKey]);

	// Mount SecureFields
	useEffect(() => {
		const mountSecureFields = async () => {
			if (mercadoPago) {
				setIdTypes(await mercadoPago.getIdentificationTypes());

				const baseStyles = {
					color: config.style.color,
					placeholderColor: config.style.placeholderColor,
				};
				let baseBorderColor: string;
				let persistBorderError: { [key: string]: boolean } = {
					cardNumber: false,
					expirationDate: false,
					securityCode: false,
				};

				const getPaymentMethodId = async ({ bin }: { bin: string }) => {
					if (bin) {
						const { results } = await mercadoPago.getPaymentMethods({ bin });
						if (results.length) {
							setPaymentMethodInfo({
								brand: results[0].id,
								paymentType: results[0].payment_type_id,
							});
						}
					} else {
						setPaymentMethodInfo({
							brand: '',
							paymentType: '',
						});
					}
				};

				const getBaseBorderColor = ({ field }: { field: string }) => {
					baseBorderColor = getComputedStyle(
						document.getElementById(field)!
					).borderColor;
				};

				const changeBorderColorFocus = ({ field }: { field: string }) => {
					if (persistBorderError[field]) return;
					document.getElementById(field)!.style.borderColor =
						config.style.focusBorderColor;
				};

				const changeBorderColorBlur = ({ field }: { field: string }) => {
					if (persistBorderError[field]) return;
					document.getElementById(field)!.style.borderColor = baseBorderColor;
				};

				const changeBorderColorError = ({ field }: { field: string }) => {
					document.getElementById(field)!.style.borderColor =
						config.style.errorBorderColor;
				};

				const setValidations = ({
					field,
					errorMessages,
				}: {
					field: string;
					errorMessages: IErrorMessages[];
				}) => {
					if (errorMessages.length) {
						const error = getErrorMessage(errorMessages) as IErrorMessages;
						persistBorderError[field] = true;
						setErrorMessages((prev) => ({
							...prev,
							[field]: {
								invalid: true,
								type: error.cause,
								error: error.message,
							},
						}));
						changeBorderColorError({ field });
					} else {
						persistBorderError[field] = false;
						setErrorMessages((prev) => ({
							...prev,
							[field]: {
								invalid: false,
								type: '',
								error: '',
							},
						}));
						changeBorderColorFocus({ field });
					}
				};

				// Card Number Input
				mercadoPago.fields
					.create('cardNumber', {
						placeholder: config.placeholder.cardNumber,
						style: baseStyles,
					})
					.mount('cardNumber')
					.on('focus', changeBorderColorFocus)
					.on('blur', changeBorderColorBlur)
					.on('validityChange', setValidations)
					.on('binChange', getPaymentMethodId)
					.on('ready', getBaseBorderColor);
				// Expiration Date input
				mercadoPago.fields
					.create('expirationDate', {
						placeholder: config.placeholder.expirationDate,
						style: baseStyles,
					})
					.mount('expirationDate')
					.on('focus', changeBorderColorFocus)
					.on('blur', changeBorderColorBlur)
					.on('validityChange', setValidations);
				// Security code input
				mercadoPago.fields
					.create('securityCode', {
						placeholder: config.placeholder.securityCode,
						style: baseStyles,
					})
					.mount('securityCode')
					.on('focus', changeBorderColorFocus)
					.on('blur', changeBorderColorBlur)
					.on('validityChange', setValidations);
			}
		};
		mountSecureFields();
	}, [
		config.placeholder.cardNumber,
		config.placeholder.expirationDate,
		config.placeholder.securityCode,
		config.style.color,
		config.style.errorBorderColor,
		config.style.focusBorderColor,
		config.style.placeholderColor,
		mercadoPago,
	]);

	return {
		idTypes,
		errorMessages,
		createCardToken,
		paymentMethodInfo,
	};
};
