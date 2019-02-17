import React from 'react';
import mockData from './mockData.json';
import { Form, Input, Checkbox, Button, Icon, Slider, Switch, Row, Col } from 'antd';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import { FormComponentProps } from 'antd/lib/form/Form';

interface Values {
	firstName: string;
	lastName: string;
	email: string;
}

type Options = {
	title: string;
	value: string | boolean | number;
};

type FieldData = {
	name: string;
	component: string;
	type?: string;
	title: string;
	prompt?: string;
	instruction?: string;
	placeholder?: string;
	required?: boolean;
	validation?: string;
	options?: Options[];
	defaultValue?: any;
};

type SectionData = {
	name: string;
	title: string;
	fields: FieldData[];
};

const isFieldTypeValid = (input: string): boolean => {
	const valid: string[] = ['date', 'password', 'number', 'text'];
	return valid.includes(input.toLowerCase());
};

class Application extends React.Component<FormComponentProps> {

	handleSubmit = (e: React.FormEvent<any>) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			wrapperCol: { span: 14 },
		};

		const data: SectionData[] = mockData.data;
		let components: JSX.Element[] = [];
		let count: number = 0;
		data.forEach((section: SectionData, index: number) => {
			count++;
			components.push(<div key={count}>Section {index + 1}:</div>);
			section.fields.forEach((field: FieldData) => {

				let label = [
					field.title != undefined ? <div>{field.title}</div> : undefined,
					field.prompt != undefined ? <div>{field.prompt}</div> : undefined,
					field.instruction != undefined ? <div>{field.instruction}</div> : undefined,
				];

				let item;
				count++;

				// TODO: add validation pattern support (and types like "email" and "url")

				switch (field.component.toLowerCase()) {
					case 'input':
						item = (
							<Form.Item key={count} {...formItemLayout}>
									{label}
									{getFieldDecorator(field.name, {
									initialValue: field.defaultValue !== undefined ? field.defaultValue : undefined,
									rules: [{ required: field.required, message: 'Required!' }],
								})(
									<Input
										type={
											field.type !== undefined && isFieldTypeValid(field.type)
												? field.type
												: undefined
										}
										placeholder={field.placeholder !== undefined ? field.placeholder : undefined}
									/>
								)}
							</Form.Item>
						);
						break;
					case 'checkbox':
						const options =
							field.options !== undefined
								? field.options.map((option: { title: string; value: any }, index: number) => (
										<Row>
											<Col span={36}>
												<Checkbox key={index} value={option.value}>
													{option.title}
												</Checkbox>
											</Col>
										</Row>
								  ))
								: undefined;
						item = (
							<Form.Item key={count} {...formItemLayout}>
								{label}
								{getFieldDecorator(field.name, {
									initialValue: field.defaultValue !== undefined ? field.defaultValue : undefined,
								})(<Checkbox.Group>{options}</Checkbox.Group>)}
							</Form.Item>
						);
						break;
					default:
						console.log('invalid form element!');
						item = <div>undefined</div>;
				}
				components.push(item);
			});
		});

		return <Form onSubmit={this.handleSubmit}>{components}</Form>;
	}
}

// export default Application;
export default Form.create<{}>()(Application);
