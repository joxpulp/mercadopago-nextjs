interface IMPFormField {
	id: 'cardNumber' | 'expirationDate' | 'securityCode';
	label: string;
	errorMessage: { invalid: boolean; type: string; error: string };
}

function MPFormField({ id, label, errorMessage }: IMPFormField) {
	return (
		<div className="w-full flex flex-col gap-[5px]">
			<label>{label}</label>
			<div
				id={id}
				className="w-full border border-[#D4D8E1] transition-all duration-200 h-[48px] px-[15px] py-[13px] rounded-[4px]"
			></div>
			{errorMessage.invalid && (
				<div className="text-red-500">{errorMessage.error}</div>
			)}
		</div>
	);
}

export default MPFormField;
