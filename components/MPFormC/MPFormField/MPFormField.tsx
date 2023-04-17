import { IErrorMessagesObject } from '../../../hooks/useMercadoPago/interfaces';
interface IMPFormField {
	id: 'cardNumber' | 'expirationDate' | 'securityCode';
	label: string;
	errorMessage: IErrorMessagesObject;
	focusState: boolean;
}

function MPFormField({ id, label, errorMessage, focusState }: IMPFormField) {
	return (
		<div className="w-full flex flex-col gap-[5px]">
			<label>{label}</label>
			<div
				id={id}
				className={`${
					errorMessage.isInvalid
						? 'border-red-500'
						: focusState
						? 'border-purple-500'
						: 'border-[#D4D8E1]'
				} w-full border transition-all duration-200 h-[48px] px-[15px] py-[13px] rounded-[4px]`}
			></div>
			{errorMessage.isInvalid && (
				<div className="text-red-500">{errorMessage.message}</div>
			)}
		</div>
	);
}

export default MPFormField;
