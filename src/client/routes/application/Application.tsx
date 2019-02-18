import React, { JSXElementConstructor } from 'react';
import mockData from './mockData.json';
// import institutions from './us_institutions.json';
import institutions from './institutions2.json';
import { Form, Input, Checkbox, Button, Icon, Slider, Switch, Row, Col, Select } from 'antd';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import { FormComponentProps } from 'antd/lib/form/Form';

const Option = Select.Option;

// interface Values {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// }

interface State {
	institutions: string[];
}

type Options = {
	title: string;
	value: string | boolean | number;
};

// type Institution = {
// 	institution: string;
// };

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

class Application extends React.Component<FormComponentProps, State> {
	state = { institutions: [] };
	// loadedInstitutions = institutions;

	componentDidMount() {
		// const data: SectionData[] = mockData.data;
		// fetch would go here
		this.setState({ institutions: institutions });
	}

	// public shouldComponentUpdate(nextProps:, nextState) {

	// }

	handleSubmit = (e: React.FormEvent<any>) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	generateInstitutions = (): JSX.Element[] =>
		this.state.institutions.map((option: string, index: number) => (
			<Option key={option}>{option}</Option>
		));

	// school = this.generateInstitutions();

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
				let options;
				count++;

				// TODO: add validation pattern support (and types like "email" and "url")

				switch (field.component.toLowerCase()) {
					case 'input':
						item = (
							<Form.Item key={count} {...formItemLayout}>
								{label}
								{getFieldDecorator(field.name, {
									initialValue: field.defaultValue,
									rules: [{ required: field.required, message: 'Required!' }],
								})(
									<Input
										type={
											field.type !== undefined && isFieldTypeValid(field.type)
												? field.type
												: undefined
										}
										placeholder={field.placeholder}
									/>
								)}
							</Form.Item>
						);
						break;
					case 'checkbox':
						options =
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
									initialValue: field.defaultValue,
								})(<Checkbox.Group>{options}</Checkbox.Group>)}
							</Form.Item>
						);
						break;
					case 'select':
						if (field.type === 'autocomplete') {
							console.log('rendered auto complete!');
							options = this.generateInstitutions();
							item = (
								<Form.Item key={count} {...formItemLayout}>
									{label}
									{getFieldDecorator(field.name, {
										initialValue: field.defaultValue !== undefined ? field.defaultValue : undefined,
									})(
										<Select showArrow={true} placeholder={field.placeholder} showSearch={true}>
											{options}
										</Select>
									)}
								</Form.Item>
							);
						} else {
							options =
								field.options !== undefined
									? field.options.map((option: { title: string; value: any }, index: number) => (
											<Option key={option.value}>{option.title}</Option>
									  ))
									: undefined;
							item = (
								<Form.Item key={count} {...formItemLayout}>
									{label}
									{getFieldDecorator(field.name, {
										initialValue: field.defaultValue !== undefined ? field.defaultValue : undefined,
									})(
										<Select showArrow={true} placeholder={field.placeholder} showSearch={true}>
											{options}
										</Select>
									)}
								</Form.Item>
							);
						}
						break;
					default:
						console.log('invalid form element!');
						item = <div>undefined</div>;
				}
				components.push(item);
			});
		});

		return (
			<Form onSubmit={this.handleSubmit}>
				{/* {this.state.form}
				{this.state.test} */}
				{components}
				<Form.Item key={count} {...formItemLayout}>
					{getFieldDecorator('test')(
						<Select showArrow={true} placeholder={'test'} showSearch={true}>
							{this.generateInstitutions()}
						</Select>
					)}
				</Form.Item>
			</Form>
		);
	}
}

// export default Application;
export default Form.create<{}>()(Application);
