import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	IIdentificationTypes,
	ICreateCardToken,
	ICardInfo,
	IFieldData,
} from '../../hooks/useMercadoPago/interfaces';
import { useMercadoPago } from '../../hooks/useMercadoPago/useMercadoPago';
import CustomSelectInput from '../Inputs/CustomSelectInput';
import MPFormField from './MPFormField/MPFormField';

interface IMPFormContext {
	fieldData: IFieldData;
	setPlaceholder: Dispatch<SetStateAction<IPlaceholderState>>;
	idTypes: IIdentificationTypes[] | undefined;
	createCardToken(cardInfo: ICardInfo): Promise<ICreateCardToken | unknown>;
}

interface IPlaceholderState {
	cardNumber?: string;
	expirationDate?: string;
	securityCode?: string;
}

interface IMPForm {
	publicKey: string;
	style: {
		color: string;
		placeholderColor: string;
	};
	className?: string;
	children: ReactNode;
}

interface IMPFormField {
	label: string;
	placeholder: string;
}

const MPFormContext = createContext<IMPFormContext>({} as IMPFormContext);

const useMPFormContext = () => {
	const context = useContext(MPFormContext);
	if (!context) {
		throw new Error('useMPFormContext is outside of parent context component');
	}
	return context;
};

function MPFormC({ children, style, className, publicKey }: IMPForm) {
	const [placeholder, setPlaceholder] = useState<IPlaceholderState>({});
	const { fieldData, idTypes, createCardToken } = useMercadoPago(publicKey, {
		style,
		placeholder,
	});

	return (
		<MPFormContext.Provider
			value={{
				fieldData,
				setPlaceholder,
				idTypes,
				createCardToken,
			}}
		>
			<div className={className}>{children}</div>
		</MPFormContext.Provider>
	);
}

MPFormC.CardNumber = function MPFormCardNumber({
	label,
	placeholder,
}: IMPFormField) {
	const { setPlaceholder, fieldData } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, cardNumber: placeholder }));
	}, [placeholder, setPlaceholder]);

	return (
		<MPFormField
			label={label}
			id="cardNumber"
			focusState={fieldData.cardNumber.isFocus}
			errorMessage={fieldData.cardNumber.error}
		/>
	);
};

MPFormC.ExpirationDate = function MPFormExpirationDate({
	label,
	placeholder,
}: IMPFormField) {
	const { setPlaceholder, fieldData } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, expirationDate: placeholder }));
	}, [placeholder, setPlaceholder]);

	return (
		<MPFormField
			label={label}
			id="expirationDate"
			focusState={fieldData.expirationDate.isFocus}
			errorMessage={fieldData.expirationDate.error}
		/>
	);
};

MPFormC.SecurityCode = function MPFormSecurityCode({
	label,
	placeholder,
}: IMPFormField) {
	const { setPlaceholder, fieldData } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, securityCode: placeholder }));
	}, [placeholder, setPlaceholder]);

	return (
		<MPFormField
			label={label}
			id="securityCode"
			focusState={fieldData.securityCode.isFocus}
			errorMessage={fieldData.securityCode.error}
		/>
	);
};

MPFormC.DocumentSelect = function MPFormDocumenSelect({
	inputName,
	label,
}: {
	inputName: string;
	label: string;
}) {
	const { idTypes } = useMPFormContext();
	const idModeling = idTypes?.map((id) => {
		return {
			id: id.id,
			option: id.name,
		};
	});
	return (
		<div className='w-full'>
			<CustomSelectInput
				label={label}
				inputName={inputName}
				value={'dni'}
				options={idModeling}
			/>
		</div>
	);
};

export default MPFormC;
