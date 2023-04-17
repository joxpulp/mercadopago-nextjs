import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { RiArrowDownSFill } from 'react-icons/ri';
import { ErrorMessage, useField } from 'formik';
import Flag from 'react-flagkit';

export interface CustomSelectInputProps {
	label?: string;
	options?: {
		id?: number | string;
		option?: string;
		isoCode?: string;
		label?: string;
		code?: string;
	}[];
	inputName: string;
	required?: boolean;
	placeholder?: string;
	value: string;
}

function CountryOption(countryCode: string, optionLabel: string | undefined) {
	return (
		<div className="flex">
			<Flag className="mr-3.5" country={countryCode.toUpperCase()} size={20} />
			<span>{optionLabel}</span>
		</div>
	);
}

function CustomSelectInput({
	label,
	options,
	inputName,
	required = false,
	placeholder,
	...props
}: CustomSelectInputProps) {
	const [field, meta, helpers] = useField(inputName);
	const { setValue } = helpers;

	return (
		<div>
			<label className="label-form">
				{label} {required ? '*' : ''}
			</label>
			<Listbox {...field} value={field.value} onChange={setValue}>
				{({ open }) => (
					<div className="relative mt-1 text-[14px] text-left">
						<Listbox.Button
							className={`w-full relative border border-solid rounded-[4px] py-[13px] px-[15px] focus:border-grey-700
              ${
								meta.error && meta.touched
									? 'border-red-500'
									: open
									? 'border-grey-700'
									: 'border-[#D4D8E1]'
							}
              `}
						>
							<div
								className={`block text-left truncate text-grey-700 font-semibold w-[98%] ${
									!field.value && 'text-grey-600 font-semibold text-[15px]'
								}`}
							>
								{field.value?.label && field.value.code ? (
									CountryOption(field.value.code, field.value.label)
								) : (
									<span>
										{!field.value?.option ? placeholder : field.value.option}
									</span>
								)}
							</div>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<RiArrowDownSFill
									className="w-5 h-5 text-grey-600"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>
						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none tablet-m:text-sm">
								{options?.map((option) => (
									<Listbox.Option key={option.id} value={option} as={Fragment}>
										{({ active }) => (
											<li
												className={`${
													active
														? 'bg-gray-200 transition duration-200 ease-in-out'
														: 'bg-white'
												} flex items-center select-none cursor-pointer relative py-2 px-5 text-[15px] active:bg-gray-300 text-grey-700`}
											>
												{option.code ? (
													CountryOption(option.code, option.label)
												) : (
													<span>{option.option}</span>
												)}
											</li>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				)}
			</Listbox>
			<div className="text-red-500 mt-[5px]">
				<ErrorMessage name={inputName} />
			</div>
		</div>
	);
}

export default CustomSelectInput;
