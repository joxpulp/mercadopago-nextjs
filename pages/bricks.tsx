import React from 'react';
import { useMercadoPagoOld } from '../hooks/useMercadoPagoOld/useMercadoPagoOld';
import { useEffect } from 'react';

declare global {
  interface Window {
    cardPaymentBrickController: any;
  }
}

export default function Bricks() {
  const mp = useMercadoPagoOld('TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c', 'AR');
  // Custom Submit
  const onSubmit = async () => {
    const formData = await window.cardPaymentBrickController.getFormData();
    const additionalData =
      await window.cardPaymentBrickController.getAdditionalData();
    console.log(formData, additionalData);
  };

  useEffect(() => {
    const renderCardPaymentBrick = async (bricksBuilder: any) => {
      const settings = {
        initialization: {
          amount: 10.0,
          payer: {
            email: 'joxpulp@gmail.com',
          },
        },
        customization: {
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
          },
        },
        callbacks: {
          onReady: () => {},
          onError: (error: any) => {
            // callback llamado para todos los casos de error de Brick
            console.error(error);
          },
        },
      };

      window.cardPaymentBrickController = await bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        settings
      );
    };

    if (mp) {
      const bricksBuilder = mp.bricks();
      renderCardPaymentBrick(bricksBuilder);
    }

    return () => {
      // Unmount Bricks
      window.cardPaymentBrickController?.unmount();
    };
  }, [mp]);
  return (
    <div className="w-[50%]">
      <div id="cardPaymentBrick_container" className="form-mp"></div>
      <button className="bg-pink-300 w-full" onClick={onSubmit}>
        Pagar
      </button>
    </div>
  );
}
