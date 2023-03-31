import React, { useState } from 'react';
import { useEffect } from 'react';
import { useMercadoPago } from '../../hooks/useMercadoPago';

interface MercadoPagoFormProps {
	publicKey: string;
}

interface IdProps {
	id: string;
	name: string;
	type: string;
	minLength: number;
	maxLength: number;
}

interface isErrorProps {
	[k: string]: boolean | null;
}

function MercadoPagoForm({ publicKey }: MercadoPagoFormProps) {
	const { mp } = useMercadoPago(publicKey, 'AR');
	const [idTypes, setIdTypes] = useState<IdProps[]>();

	useEffect(() => {
		const loadSecureFields = async () => {
			const baseStyles = {
				color: 'red',
			};

			let isError: isErrorProps = {
				cardNumber: null,
				expirationDate: null,
				securityCode: null,
			};

			const changeBorderColorFocus = (e: { field: string }) => {
				if (isError[e.field] === true) return;
				document!.getElementById(e.field)!.style.borderColor = '#950EE1';
			};

			const changeBorderColorBlur = (e: { field: string }) => {
				if (isError[e.field] === true) return;
				document!.getElementById(e.field)!.style.borderColor = '#D4D8E1';
			};

			const changeBorderColorError = (e: { field: string }) => {
				document!.getElementById(e.field)!.style.borderColor = '#FF455C';
			};

			const setValidations = (e: { field: string; errorMessages: [] }) => {
				if (e.errorMessages.length) {
					console.log(e);
					isError[e.field] = true;
					changeBorderColorError(e);
				} else {
					isError[e.field] = false;
					changeBorderColorFocus(e);
				}
			};

			setIdTypes(await mp.getIdentificationTypes());

			mp.fields
				.create('cardNumber', {
					placeholder: 'Rellena tarjeta',
					style: baseStyles,
				})
				.mount('cardNumber')
				.on('focus', changeBorderColorFocus)
				.on('blur', changeBorderColorBlur)
				.on('validityChange', setValidations);
			// Expiration Date input
			mp.fields
				.create('expirationDate', {
					placeholder: 'Expiration date',
					style: baseStyles,
				})
				.mount('expirationDate')
				.on('focus', changeBorderColorFocus)
				.on('blur', changeBorderColorBlur)
				.on('validityChange', setValidations);
			// Security code input
			mp.fields
				.create('securityCode', {
					placeholder: 'Codigo de seguridad',
					style: baseStyles,
				})
				.mount('securityCode')
				.on('focus', changeBorderColorFocus)
				.on('blur', changeBorderColorBlur)
				.on('validityChange', setValidations);
		};

		if (mp) {
			loadSecureFields();
		}
	}, [mp]);

	const styles =
		'w-full border border-[#D4D8E1] h-[48px] px-[15px] py-[13px] rounded-[4px]';

	return (
		<div className="m-[20px] w-[50%] flex flex-col gap-[13px]">
			<div id="cardNumber" className={styles}></div>
			<div className="flex gap-[13px]">
				<div id="expirationDate" className={styles}></div>
				<div id="securityCode" className={styles}></div>
			</div>
			<div className="flex gap-[13px]">
				{/* Here we can use the custom select that we already have */}
				{idTypes && (
					<select className={styles} name="idTypes">
						{idTypes.map((id) => (
							<option key={id.id} value={id.id}>
								{id.name}
							</option>
						))}
					</select>
				)}
				<input className={styles} type="text" />
			</div>
		</div>
	);
}

export default MercadoPagoForm;
