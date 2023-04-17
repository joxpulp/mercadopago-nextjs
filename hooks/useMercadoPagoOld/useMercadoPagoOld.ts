import { useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export const useMercadoPagoOld = (publicKey: string, country: string) => {
  const [mp, setMp] = useState<any>();
  useEffect(() => {
    const mpLoad = async () => {
      await loadMercadoPago();
      setMp(
        new window.MercadoPago(publicKey, {
          locale: `es-${country}`,
          trackingDisabled: true,
        })
      );
    };
    mpLoad();
  }, [publicKey, country]);
  return mp;
};
