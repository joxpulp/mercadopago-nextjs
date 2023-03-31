import { useEffect, useState } from 'react';
import { loadMercadoPago } from '@mercadopago/sdk-js';

declare global {
	interface Window {
		MercadoPago: any;
	}
}

export const useMercadoPago = (publicKey: string, country: string) => {
	const [mp, setMp] = useState<any>();
	useEffect(() => {
		const mpLoad = async () => {
			await loadMercadoPago();
			setMp(
				new window.MercadoPago(publicKey, {
					locale: `es-${country}`,
				})
			);
		};
		mpLoad();
	}, [publicKey, country]);
	return mp;
};
