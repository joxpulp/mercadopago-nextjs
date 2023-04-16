import { useCallback, useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
	ICardInfo,
	IConfig,
	ICreateCardToken,
	IErrorMessages,
	IErrorMessagesObject,
	IErrorMessagesState,
	IFocusState,
	IIdentificationTypes,
	IPaymentMethodInfo,
} from './interfaces';
import { getErrorMessage } from './util';

declare global {
	interface Window {
		createCardToken: any;
		MercadoPago: any;
	}
}

export const useMercadoPago = (publicKey: string, config: IConfig) => {
	const [mercadoPago, setMercadoPago] = useState<any>();
	const [focusState, setIsFocusState] = useState<IFocusState>({
		cardNumber: { focus: false },
		expirationDate: { focus: false },
		securityCode: { focus: false },
	});
	const [errorMessages, setErrorMessages] = useState<IErrorMessagesState>({
		cardNumber: { invalid: false } as IErrorMessagesObject,
		expirationDate: { invalid: false } as IErrorMessagesObject,
		securityCode: { invalid: false } as IErrorMessagesObject,
	});
	const [idTypes, setIdTypes] = useState<IIdentificationTypes[]>();
	const [paymentMethodInfo, setPaymentMethodInfo] =
		useState<IPaymentMethodInfo>({
			brand: '',
			cardType: '',
		});

	const setFocusState = ({ field }: { field: string }) => {
		setIsFocusState((prev) => ({
			...prev,
			[field]: { focus: true },
		}));
	};

	const setBlurState = ({ field }: { field: string }) => {
		setIsFocusState((prev) => ({
			...prev,
			[field]: { focus: false },
		}));
	};

	const setValidations = ({
		field,
		errorMessages,
	}: {
		field: string;
		errorMessages: IErrorMessages[];
	}) => {
		if (errorMessages.length) {
			const errorMessage = getErrorMessage(errorMessages) as IErrorMessages;
			setErrorMessages((prev) => ({
				...prev,
				[field]: {
					invalid: true,
					error: errorMessage.message,
				},
			}));
		} else {
			setErrorMessages((prev) => ({
				...prev,
				[field]: {
					invalid: false,
					error: '',
				},
			}));
		}
	};

	const getPaymentMethodId = useCallback(
		async ({ bin }: { bin: string }) => {
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
		},
		[mercadoPago]
	);

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
					const errorMessages = error as IErrorMessages[];
					errorMessages.map((e) => {
						if (e.field === 'expirationMonth' || e.field === 'expirationYear') {
							setErrorMessages((prev) => ({
								...prev,
								expirationDate: {
									invalid: true,
									error: getErrorMessage(errorMessages, e.field)
										?.message as string,
								},
							}));
						} else {
							setErrorMessages((prev) => ({
								...prev,
								[e.field]: {
									invalid: true,
									error: getErrorMessage(errorMessages, e.field)
										?.message as string,
								},
							}));
						}
					});
				}
			}
		},
		[mercadoPago]
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
				const baseStyles = {
					color: config.style.color,
					placeholderColor: config.style.placeholderColor,
				};

				// Set createCardToken Method in global variable
				window.createCardToken = createCardToken;
				setIdTypes(await mercadoPago.getIdentificationTypes());

				// Card Number Input Mounting
				fields.cardNumber = mercadoPago.fields
					.create('cardNumber', {
						placeholder: config.placeholder.cardNumber,
						style: baseStyles,
					})
					.mount('cardNumber')
					.on('focus', setFocusState)
					.on('blur', setBlurState)
					.on('validityChange', setValidations)
					.on('binChange', getPaymentMethodId);
				// Expiration Date input Mounting
				fields.expirationDate = mercadoPago.fields
					.create('expirationDate', {
						placeholder: config.placeholder.expirationDate,
						style: baseStyles,
					})
					.mount('expirationDate')
					.on('focus', setFocusState)
					.on('blur', setBlurState)
					.on('validityChange', setValidations);
				// Security code input Mounting
				fields.securityCode = mercadoPago.fields
					.create('securityCode', {
						placeholder: config.placeholder.securityCode,
						style: baseStyles,
					})
					.mount('securityCode')
					.on('focus', setFocusState)
					.on('blur', setBlurState)
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
		config.style.placeholderColor,
		mercadoPago,
		getPaymentMethodId,
	]);

	return {
		idTypes,
		errorMessages,
		focusState,
		createCardToken,
		paymentMethodInfo,
	};
};
