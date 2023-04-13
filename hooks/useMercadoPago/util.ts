import { IErrorMessages } from "./interfaces";

export const getErrorMessage = (errorMessages: IErrorMessages[]) => {
  const invalidValue = errorMessages.find(
    (error) => error.cause === 'invalid_value'
  );
  if (invalidValue) {
    return invalidValue;
  }
  return errorMessages.find((error) => error.cause === 'invalid_length');
};