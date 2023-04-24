import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import React from 'react';

initMercadoPago('TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c', {
  locale: 'es-AR',
});

declare global {
  interface Window {
    cardPaymentBrickController: any;
  }
}

export default function BricksReact() {
  // Submit
  const onSubmit = async () => {
    const formData = await window.cardPaymentBrickController.getFormData();
    console.log(formData);
  };

  return (
    <div className="m-[20px] w-[50%] flex flex-col gap-[13px] ">
      <div className="form-mp">
        <CardPayment
          initialization={{
            amount: 2,
            payer: { email: 'joxpulp@gmail.com' },
          }}
          onSubmit={async (params) => console.log(params)}
          customization={{
            visual: {
              hideFormTitle: true,
              hidePaymentButton: true,
              style: {
                customVariables: {
                  baseColor: '#3CA870',
                  outlinePrimaryColor: '#D4D8E1',
                  borderRadiusMedium: '4px',
                  inputVerticalPadding: '13px',
                  inputHorizontalPadding: '15px',
                  inputFocusedBorderWidth: '1px',
                },
              },
              texts: {
                cardNumber: {
                  label: 'Número de la tarjeta',
                },
                expirationDate: {
                  label: 'Fecha de vencimiento',
                },
                securityCode: {
                  label: 'Código CVC',
                },
              },
            },
          }}
        />
        <button
          onClick={onSubmit}
          className="rounded-md bg-green-400 p-[10px] w-fit"
        >
          Enviar Pago
        </button>
      </div>
    </div>
  );
}
