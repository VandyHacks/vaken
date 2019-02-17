import React from 'react';
import mockData from './mockData.json';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikActions, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Input, Slider, Switch } from 'antd';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import LoginForm from './Form';

// const SignupSchema = Yup.object().shape({
// 	name: Yup.string()
// 		.min(2, 'Too Short!')
// 		.max(70, 'Too Long!')
// 		.required('Required'),
// 	email: Yup.string()
// 		.email('Invalid email')
// 		.required('Required'),
// });

interface Values {
	firstName: string;
	lastName: string;
	email: string;
}

type Options = {
	title: string,
	value: string | boolean | number,
}

type FieldData = {
	name: string,
	component: string,
	type?: string,
	title: string,
	prompt?: string,
	instruction?: string,
	placeholder?: string,
	required?: boolean,
	validation?: string,
	options?: Options[],
	value?: string | boolean | number;
}

type SectionData = {
	name: string;
	title: string;
	fields: FieldData[];
}

const Application = (): JSX.Element => {
	// const customInput = ({
	// 	field, // { name, value, onChange, onBlur }
	// 	form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
	// 	...props
	// }) => <Input {...field} {...props} />;

	// console.log(mockData.data);
	let data: SectionData[] = mockData.data;
	// let data: { { name: string, , } } = mockData.data;
	let components: JSX.Element[] = [];
	let count: number = 0;
	data.forEach((section: SectionData, index: number) => {
		count++;
		components.push(<div key={count}>Section {index + 1}:</div>);
		section.fields.forEach((field: FieldData) => {
			// let custom: JSX.Element | null = null;
			let component: string = '';
			let props: object = {};
			let options: JSX.Element[] | null = null;
			Object.entries(field).forEach(([key, value]) => {
				if (key === 'component' && value === 'slider') {
					value = 'textarea';
				} else if (key === 'component' && value === 'input') {
					// value = <Input/>;
					// value = customInput;
					// component = "Input"
					return;
				} else if (key === 'validation') {
					key = 'validate';
					value = (input: any) => !new RegExp(value, 'i').test(input);
				} else if (key === 'options' && typeof value === "object") {
					options = value.map((option: { title: string; value: any }, index: number) => (
						<option key={index} value={option.value}>
							{option.title}
						</option>
					));
					console.log(options);
				}
				props[key] = value;
				// console.log(key, value);
			});
			count++;

			components.push(
				<Field key={count} {...props}>
					{options}
				</Field>
			);
		});
	});

	const form = (
		<FlexRow>
			<FlexColumn>
				<Formik
					initialValues={{ firstName: '', lastName: '', email: '', color: 'red' }}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));
							actions.setSubmitting(false);
						}, 1000);
					}}
					render={(props: FormikProps<Values>) => (
						<form onSubmit={props.handleSubmit}>
							{components}
							<button type="submit">Submit</button>
						</form>
					)}
				/>
			</FlexColumn>
		</FlexRow>
	);

	return (
	<>
		<LoginForm />
	</>);
};

export default Application;
