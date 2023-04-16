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
	IErrorMessagesState,
	ICreateCardToken,
	ICardInfo,
	IFocusState,
} from '../../hooks/useMercadoPago/interfaces';
import { useMercadoPago } from '../../hooks/useMercadoPago/useMercadoPago';
import MPFormField from './MPFormField/MPFormField';

interface IMPFormContext {
	idTypes: IIdentificationTypes[] | undefined;
	focusState: IFocusState;
	errorMessages: IErrorMessagesState;
	createCardToken(cardInfo: ICardInfo): Promise<ICreateCardToken | unknown>;
	setPlaceholder: Dispatch<SetStateAction<IPlaceholderState>>;
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
	const { idTypes, errorMessages, createCardToken, focusState } =
		useMercadoPago(publicKey, { style, placeholder });

	return (
		<MPFormContext.Provider
			value={{
				idTypes,
				errorMessages,
				createCardToken,
				setPlaceholder,
				focusState,
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
	const { errorMessages, setPlaceholder, focusState } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, cardNumber: placeholder }));
	}, [placeholder, setPlaceholder]);
	return (
		<MPFormField
			label={label}
			id="cardNumber"
			focusState={focusState.cardNumber}
			errorMessage={errorMessages.cardNumber}
		/>
	);
};

MPFormC.ExpirationDate = function MPFormExpirationDate({
	label,
	placeholder,
}: IMPFormField) {
	const { errorMessages, setPlaceholder, focusState } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, expirationDate: placeholder }));
	}, [placeholder, setPlaceholder]);

	return (
		<MPFormField
			label={label}
			id="expirationDate"
			focusState={focusState.expirationDate}
			errorMessage={errorMessages.expirationDate}
		/>
	);
};

MPFormC.SecurityCode = function MPFormSecurityCode({
	label,
	placeholder,
}: IMPFormField) {
	const { errorMessages, setPlaceholder, focusState } = useMPFormContext();

	useEffect(() => {
		setPlaceholder((prev) => ({ ...prev, securityCode: placeholder }));
	}, [placeholder, setPlaceholder]);

	return (
		<MPFormField
			label={label}
			id="securityCode"
			focusState={focusState.securityCode}
			errorMessage={errorMessages.securityCode}
		/>
	);
};

export default MPFormC;
