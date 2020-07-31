import React, { Component } from 'react';
import { Form, Input, Select, Button,  Row, Col  } from 'antd';

const { Option } = Select;

// class FormSearch extends Component{
const FormSearch = (props) => {
	const [form] = Form.useForm();
	console.log(props);
	// form.setFieldsValue({status:''})
	return (
		<Form
		form={form}
		name="advanced_search"
		className="ant-advanced-search-form"
		onFinish={(values) => {
			props.searchLists(values)
		}}
		>
			<Row gutter={24}>
				<Form.Item
				label="账户名"
				name="email"
				style={{ paddingLeft:8,paddingRight:8 }}
				>
					<Input placeholder="账户名" />
				</Form.Item>

				<Form.Item
				label="状态"
				name="status"
				>
				<Select  style={{ width: 120,paddingLeft:8,paddingRight:8	 }} >
					<Option value="">全部</Option>
					<Option value="1">启用</Option>
					<Option value="2">停用</Option>
				</Select>
				</Form.Item>

			</Row>
			<Row>
				<Col span={24} style={{ textAlign: 'right' }}>
					<Button type="primary" htmlType="submit" >
					搜索
					</Button>
					<Button
					style={{ margin: '0 8px' }}
					onClick={() => {
						form.resetFields();
						props.resetSearch();
					}}
					>
					重置
					</Button>
				</Col>
			</Row>
		</Form>
	);
}

export default FormSearch;