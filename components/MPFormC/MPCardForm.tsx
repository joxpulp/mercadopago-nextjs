import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { ICreateCardToken } from '../../hooks/useMercadoPago/interfaces';
import TextInput from '../Inputs/TextInput';
import MPFormC from './ MPFormC';
import Image from 'next/image';

function MPCardForm() {
	const initialValues = {
		cardholderName: '',
		documentType: null,
		documentNumber: '',
	};

	const validationSchema = Yup.object({
		cardholderName: Yup.string().required('Name is required'),
		documentType: Yup.object().required('Document Type is required'),
		documentNumber: Yup.string().required('Document Number is required'),
	});

	const onSubmit = async (values: any, setTouched: any, isValid: boolean) => {
		const fields = {
			cardholderName: true,
			documentType: true,
			documentNumber: true,
		};
		// Trigger validations manually
		setTouched(fields);
		// Call createCardToken
		const token = (await window.createCardToken({
			cardholderName: values.cardholderName,
			identificationType: values.documentType?.id ?? '',
			identificationNumber: values.documentNumber,
		})) as ICreateCardToken;

		// check if form is valid and show values, otherwise print fields are invalid
		if (token && isValid) {
			console.log(values);
			console.log(token);
		} else {
			console.log('some fields are invalid');
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={() => console.log('Submitted ok')}
			validationSchema={validationSchema}
		>
			{({ values, setTouched, isValid, handleChange }) => (
				<Form>
					<Image
						src="/assets/CMRFalabella.svg"
						width={45}
						height={45}
						alt="pepe"
					/>
					<MPFormC
						publicKey="TEST-12e0021e-da80-41e0-bf96-14d02ea8fe9c"
						fontColor="#000000"
						placeholderColor="#D4D8E1"
						className="m-[20px] w-[50%] flex flex-col gap-[13px]"
					>
						<TextInput
							inputName="cardholderName"
							label="Nombre del titular"
							handleChange={(e: any) => handleChange(e)}
							value={''}
						/>
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
						<div className="flex gap-[23px]">
							<MPFormC.DocumentSelect
								label="Tipo de documento"
								inputName="documentType"
								placeholder="Tipo de documento"
							/>
							<TextInput
								inputName="documentNumber"
								handleChange={(e: any) => handleChange(e)}
								label="Numero de documento"
								value={''}
							/>
						</div>
						<button
							type="button"
							onClick={() => onSubmit(values, setTouched, isValid)}
							className="rounded-md bg-green-400 p-[10px] w-fit"
						>
							Enviar Pago
						</button>
					</MPFormC>
				</Form>
			)}
		</Formik>
	);
}

export default MPCardForm;
