import { ErrorMessage, Field, useField } from 'formik';
import { SyntheticEvent } from 'react';
import { MdCheckCircle } from 'react-icons/md';

export interface TextInputProps {
	inputName: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	handleChange?: any;
	value: string;
	type?: string;
	onlyLetters?: boolean;
	onlyNumbers?: boolean;
	hint?: string;
	showErrorOnTouched?: boolean;
	disabled?: boolean;
	withLength?: number;
	showSpinner?: boolean;
	showSuccessIcon?: boolean;
}

function TextInput({
	inputName,
	label,
	placeholder,
	required = false,
	handleChange = null,
	type = 'text',
	onlyLetters = false,
	onlyNumbers = false,
	hint,
	showErrorOnTouched = false,
	disabled = false,
	withLength,
	showSpinner,
	showSuccessIcon,
}: TextInputProps) {
	const [_, meta, helpers] = useField(inputName);
	const { setTouched } = helpers;
	const isLetter = (value: any) =>
		!/[!@#$%^&*()_+\-0123456789=[\]{};':"\\|,.<>/?]+/.test(value);
	const isNumber = (value: any) => /^\d+$/.test(value);

	const onChange = (e: any) => {
		showErrorOnTouched && setTouched(true);
		if (
			(!onlyLetters && !onlyNumbers) ||
			(onlyLetters && isLetter(e.target.value)) ||
			(onlyNumbers && isNumber(e.target.value))
		) {
			handleChange(e);
		}
	};

	return (
		<div className="flex flex-col w-full">
			<div className="flex">
				<label className="mb-[5px]">
					{label} {required ? '*' : ''}
				</label>
			</div>
			<div className="relative">
				<Field
					className={`w-full border transition-all duration-200 h-[48px] px-[15px] py-[13px] rounded-[4px] outline-none ${
						meta.error && meta.touched
							? 'border-red-500'
							: 'border-[#D4D8E1] focus:border-purple-500'
					} ${disabled && 'bg-grey-200 text-grey-400'}`}
					type={type}
					name={inputName}
					placeholder={placeholder}
					onChange={(e: SyntheticEvent) => onChange(e)}
					value={meta.value}
					disabled={disabled}
				/>
				{withLength && (
					<span
						className={`absolute bottom-[14px] pointer-events-none right-[13px] text-[14px] font-semibold bg-white pl-[13px] text-grey-600 ${
							disabled && 'bg-grey-200 text-grey-400'
						}`}
					>
						1 / {withLength}
					</span>
				)}
			</div>
			{meta.error && (
				<div className="mt-[5px] text-red-500">
					<ErrorMessage name={inputName} />
				</div>
			)}
			{hint && <span className="text-[13px] mt-[5px]">{hint}</span>}
		</div>
	);
}

export default TextInput;
