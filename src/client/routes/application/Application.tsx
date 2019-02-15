import React from 'react';
import mockData from './mockData.json';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikActions, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Input } from 'antd';

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

const Application = (): JSX.Element => {
	// const data = JSON.parse(mockData);

	const customInput = ({
		field, // { name, value, onChange, onBlur }
		form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
		...props
	  }) => (
		<Input {...field} {...props}/>
	  );
	  
	  

	// let initialValues: string[] = [];	
	let data = mockData.data;
	let component: JSX.Element[] = [];
	let count = 0;
	data.forEach((section, index) => {
		count++;
		component.push(<div key={count}>Section {index + 1}:</div>);
		section.fields.forEach((field: any) => {
			// if (field.initialValue != undefined) {
			//     initialValues.push(field.initialValue);
			// }
			let props: object = {};
			let options: JSX.Element | null = null;
			Object.entries(field).forEach(([key, value]: any) => {
				if (key === 'component' && value === 'slider') {
					value = 'textarea';
				} else if (key === 'component' && value === 'input') {
					// value = <Input/>;
					value = customInput;
				} else if (key === 'validation') {
					key = 'validate';
					value = (input: any) => !new RegExp(value, 'i').test(input);
				} else if (key === 'options') {
					options = value.map((option: { title: string; value: any }, index: number) => (
						<option key={index} value={option.value}>
							{option.title}
						</option>
					));
					console.log(options)
				}
				props[key] = value;
				// console.log(key, value);
			});
			count++;
			// console.log(props);
			component.push(
				<Field key={count} {...props}>
					{options}
				</Field>
			);
		});
		// console.log(section);
	});

	// console.log(initialValues);
	// console.log(data);
	// console.log(data[0].fields[0].title);

	const form = (
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
					{component}
					{/* <Field name="firstName" />
					<Field name="lastName" />
					<Field type="email" name="email" placeholder="test@test.com" />
					<Field component="select" name="color">
						<option value="red">Red</option>
						<option value="green">Green</option>
						<option value="blue">Blue</option>
					</Field> */}
					<button type="submit">Submit</button>
				</form>
			)}
		/>
	);

	return <>{form}</>;
};

export default Application;
