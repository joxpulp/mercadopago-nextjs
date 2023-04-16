import { useCallback, useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
	ICardInfo,
	IConfig,
	ICreateCardToken,
	IErrorMessages,
	IErrorMessagesObject,
	IErrorMessagesState,
	IIdentificationTypes,
	IPaymentMethodInfo,
} from './interfaces';
import { changeBorderColorError, getErrorMessage } from './util';

declare global {
	interface Window {
		createCardToken: any;
		MercadoPago: any;
	}
}

export const useMercadoPago = (publicKey: string, config: IConfig) => {
	const [mercadoPago, setMercadoPago] = useState<any>();
	const [idTypes, setIdTypes] = useState<IIdentificationTypes[]>();
	const [paymentMethodInfo, setPaymentMethodInfo] =
		useState<IPaymentMethodInfo>({
			brand: '',
			cardType: '',
		});
	const [errorMessages, setErrorMessages] = useState<IErrorMessagesState>({
		cardNumber: { invalid: false } as IErrorMessagesObject,
		expirationDate: { invalid: false } as IErrorMessagesObject,
		securityCode: { invalid: false } as IErrorMessagesObject,
	});

	const createCardToken = useCallback(
		async (cardInfo: ICardInfo): Promise<ICreateCardToken | unknown> => {
			if (mercadoPago) {
				try {
					return await mercadoPago.fields.createCardToken({
						cardholderName: cardInfo.cardholderName,
						identificationType: cardInfo.identificationType,
						identificationNumber: cardInfo.identificationNumber,
					});
				} catch (error) {
					setErrorMessages({
						cardNumber: { invalid: true, error: 'CardNumber is empty' },
						expirationDate: {
							invalid: true,
							error: 'Expiration Date is empty',
						},
						securityCode: {
							invalid: true,
							error: 'SecurityCode is Empty',
						},
					});
					changeBorderColorError('cardNumber', config.style.errorBorderColor);
					changeBorderColorError(
						'expirationDate',
						config.style.errorBorderColor
					);
					changeBorderColorError('securityCode', config.style.errorBorderColor);
				}
			}
		},
		[config.style.errorBorderColor, mercadoPago]
	);

	// Initialize MercadoPago SDK
	useEffect(() => {
		const loadSecureFields = async () => {
			await loadMercadoPago();
			setMercadoPago(
				new window.MercadoPago(publicKey, {
					trackingDisabled: true,
				})
			);
		};
		loadSecureFields();
	}, [publicKey]);

	// Mount SecureFields
	useEffect(() => {
		const fields: { cardNumber: any; expirationDate: any; securityCode: any } =
			{
				cardNumber: null,
				expirationDate: null,
				securityCode: null,
			};
		const mountSecureFields = async () => {
			if (mercadoPago) {
				// Set createCardToken Method in global variable
				window.createCardToken = createCardToken;
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
								cardType: results[0].payment_type_id,
							});
						}
					} else {
						setPaymentMethodInfo({
							brand: '',
							cardType: '',
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
								error: '',
							},
						}));
						changeBorderColorFocus({ field });
					}
				};

				// Card Number Input
				fields.cardNumber = mercadoPago.fields
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
				fields.expirationDate = mercadoPago.fields
					.create('expirationDate', {
						placeholder: config.placeholder.expirationDate,
						style: baseStyles,
					})
					.mount('expirationDate')
					.on('focus', changeBorderColorFocus)
					.on('blur', changeBorderColorBlur)
					.on('validityChange', setValidations);
				// Security code input
				fields.securityCode = mercadoPago.fields
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
		return () => {
			if (mercadoPago) {
				fields.cardNumber.unmount();
				fields.expirationDate.unmount();
				fields.securityCode.unmount();
			}
		};
	}, [
		createCardToken,
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
