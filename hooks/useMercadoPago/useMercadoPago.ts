import { useCallback, useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import {
  ICardInfo,
  IConfig,
  ICreateCardToken,
  IErrorMessages,
  IFieldData,
  IIdentificationTypes,
  IMPEventAttributes,
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
  const [idTypes, setIdTypes] = useState<IIdentificationTypes[]>();
  const [paymentMethodInfo, setPaymentMethodInfo] =
    useState<IPaymentMethodInfo>({
      brand: '',
      cardType: '',
    });
  const [fieldData, setFieldData] = useState<IFieldData>({
    cardNumber: { error: { isInvalid: false }, isFocus: false },
    expirationDate: { error: { isInvalid: false }, isFocus: false },
    securityCode: { error: { isInvalid: false }, isFocus: false },
  });

  const setFocusState = ({ field }: IMPEventAttributes) => {
    setFieldData((prev) => ({
      ...prev,
      [field]: { ...prev[field], isFocus: true },
    }));
  };

  const setBlurState = ({ field }: IMPEventAttributes) => {
    setFieldData((prev) => ({
      ...prev,
      [field]: { ...prev[field], isFocus: false },
    }));
  };

  const setValidations = ({ field, errorMessages }: IMPEventAttributes) => {
    if (errorMessages.length) {
      const errorMessage = getErrorMessage(errorMessages) as IErrorMessages;
      setFieldData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error: { isInvalid: true, message: errorMessage.message },
        },
      }));
    } else {
      setFieldData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error: { isInvalid: false, message: '' },
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
              setFieldData((prev) => ({
                ...prev,
                expirationDate: {
                  ...prev.expirationDate,
                  error: {
                    isInvalid: true,
                    message: getErrorMessage(errorMessages, e.field)?.message,
                  },
                },
              }));
            } else {
              setFieldData((prev) => ({
                ...prev,
                [e.field]: {
                  ...prev[e.field as 'cardNumber' | 'securityCode'],
                  error: {
                    isInvalid: true,
                    message: getErrorMessage(errorMessages, e.field)?.message,
                  },
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
    const initMercadoPagoSDK = async () => {
      await loadMercadoPago();
      setMercadoPago(
        new window.MercadoPago(publicKey, {
          trackingDisabled: true,
        })
      );
    };
    initMercadoPagoSDK();
  }, [publicKey]);

  // Mount SecureFields
  useEffect(() => {
    // Set createCardToken Method in global variable
    window.createCardToken = createCardToken;
    const fields: { [key: string]: any } = {
      cardNumber: null,
      expirationDate: null,
      securityCode: null,
    };
    const initSecureFields = async () => {
      if (mercadoPago) {
        const baseStyles = {
          color: config.style.color,
          placeholderColor: config.style.placeholderColor,
        };

        // Set identification Types to idTypes State
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
    initSecureFields();
    return () => {
      if (mercadoPago) {
        // Unmount fields on re-render
        fields.cardNumber.unmount();
        fields.expirationDate.unmount();
        fields.securityCode.unmount();
      }
    };
  }, [
    mercadoPago,
    createCardToken,
    getPaymentMethodId,
    config.style.color,
    config.style.placeholderColor,
    config.placeholder.cardNumber,
    config.placeholder.expirationDate,
    config.placeholder.securityCode,
  ]);

  return {
    idTypes,
    fieldData,
    createCardToken,
    paymentMethodInfo,
  };
};
