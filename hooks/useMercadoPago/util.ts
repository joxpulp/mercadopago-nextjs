import { IErrorMessages } from './interfaces';

export const getErrorMessage = (
	errorMessages: IErrorMessages[],
	field?: string
) => {
	if (field) {
		const filterInvalidValue = errorMessages.filter(
			(error) => error.cause === 'invalid_value'
		);
		return filterInvalidValue.find((error) => error.field === field);
	}

	const invalidValue = errorMessages.find(
		(error) => error.cause === 'invalid_value'
	);

	if (invalidValue) {
		return invalidValue;
	} else {
		return errorMessages.find((error) => error.cause === 'invalid_length');
	}
};
