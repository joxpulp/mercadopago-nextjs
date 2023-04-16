import MPFormC from '../components/MPFormC/ MPFormC';
import { ICreateCardToken } from '../hooks/useMercadoPago/interfaces';

function SecureFieldsCompound() {
	const onSubmit = async () => {
		const token = (await window.createCardToken({
			cardholderName: 'pepe',
			identificationType: 'DNI',
			identificationNumber: '95216583',
		})) as ICreateCardToken;
		console.log(token);
	};
	return (
		<MPFormC
			publicKey="TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c"
			className="m-[20px] w-[50%] flex flex-col gap-[13px]"
			style={{
				color: '#000000',
				placeholderColor: '#D4D8E1',
				focusBorderColor: '#950EE1',
				errorBorderColor: '#FF455C',
			}}
		>
			<MPFormC.CardNumber
				label="Numero de tarjeta"
				placeholder="1234 1234 1234 1234"
			/>
			<div className="flex gap-[23px]">
				<MPFormC.ExpirationDate
					label="Fecha de caducidad"
					placeholder="MM/YY"
				/>
				<MPFormC.SecurityCode label="CCV" placeholder="Codigo CVV" />
			</div>
			<button
				onClick={onSubmit}
				className="rounded-md bg-green-400 p-[10px] w-fit"
			>
				Enviar Pago
			</button>
		</MPFormC>
	);
}

export default SecureFieldsCompound;
