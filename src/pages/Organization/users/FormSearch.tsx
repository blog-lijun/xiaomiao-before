import React, { Component } from 'react';
import { Form, Input, Select, Button,  Row, Col  } from 'antd';

const { Option } = Select;

// class FormSearch extends Component{
const FormSearch = (props) => {
	const [form] = Form.useForm();
	return (
		<Form
		form={form}
		autoComplete="off"
		name="advanced_search"
		className="ant-advanced-search-form"
		onFinish={(values) => {
			props.searchLists(values)
		}}
		>
			<Row gutter={24}>
			{/* <Form.Item
				label="部门"
				name="status"
				>
				<Select  style={{ width: 120,paddingLeft:8,paddingRight:8 }} placeholder='请选择' >
					<Option value="">全部</Option>
					<Option value="1">在职</Option>
					<Option value="2">离职</Option>
				</Select>
			</Form.Item>
			<Form.Item
				label="角色"
				name="status"
				>
				<Select  style={{ width: 120,paddingLeft:8,paddingRight:8 }} placeholder='请选择' >
					<Option value="">全部</Option>
					<Option value="1">在职</Option>
					<Option value="2">离职</Option>
				</Select>
			</Form.Item> */}
				<Form.Item
				label="姓名"
				name="name"
				style={{ paddingLeft:8,paddingRight:8	 }}
				>
					<Input placeholder="姓名" />
				</Form.Item>

				<Form.Item
				label="状态"
				name="status"
				>
				<Select  style={{ width: 120,paddingLeft:8,paddingRight:8 }} placeholder='请选择' >
					<Option value="">全部</Option>
					<Option value="1">在职</Option>
					<Option value="2">离职</Option>
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