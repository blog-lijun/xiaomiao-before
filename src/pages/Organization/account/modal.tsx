import React, { Component, useState } from 'react';
import { Form, Modal, Input, Select, message } from 'antd';
const { Option } = Select;

const CollectionCreateForm = ({ visible, submitMap, onCancel, currentDetailData, editId, users }) => {
	const [form] = Form.useForm();
	const layout = {
		labelCol: { span: 5 },
		wrapperCol: { span: 18 },
	};

	const account_user_ids = [];
	if(JSON.stringify(currentDetailData) != "{}"){
		var arr = currentDetailData.account_user_id;
		for(let i in arr){
			account_user_ids.push(arr[i] + '');
		}
		form.setFieldsValue({
			'users[]':account_user_ids
		})
	}

	let initValues = currentDetailData == undefined || currentDetailData.length == 0 ? {} :
		{
			email: currentDetailData.email,
			users: account_user_ids,
		}

	const children = [];


	for(let i in users){
		children.push(<Option key={i}>{users[i]} </Option>);
	}

	form.setFieldsValue(initValues)

	if (editId != null && editId != undefined && editId != 0 && editId != '') {
		return (
			<Modal
				getContainer={false} 
				title="新增"
				visible={visible}
				onOk={() => {
					form
						.validateFields()
						.then(values => {
							form.resetFields();
							form.setFieldsValue(values)
							submitMap(values);
						})
						.catch(info => {
							message.error('校验失败：' + info);
							console.log('校验失败:', info);
						});
				}}
				onCancel={onCancel}
				destroyOnClose
			>
				<Form
					form={form}
					{...layout}
					name="Modal create"
					// initialValues={{ remember: true }}
					// onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
					preserve={false}
	
				>
					<Form.Item
						label="账户名"
						name="email"
						rules={[
							{ required: true, message: '请输入账户名！' },
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (value) {
										if (/[\u4E00-\u9FA5]/g.test(value)) {
											return Promise.reject('不能输入汉字!');
											//   callback(new Error('只可输入字母、不能输入汉字!'));
										}
									}
									return Promise.resolve();
									//   if (!value || getFieldValue('password') === value) {
									// 	return Promise.resolve();
									//   }
									//   return Promise.reject('The two passwords that you entered do not match!');
								},
							}),
						]}
	
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="关联用户"
						name="users[]"
						rules={[
							{ required: true, message: '请选择关联用户！' },
						]}
					>
						<Select
							mode="multiple"
							placeholder="请选择"
							// defaultValue={account_user_ids}
						>
							{children}
						</Select>
	
					</Form.Item>
	
	
				</Form>
			</Modal>
		);
	} else {
		return (
			<Modal
				getContainer={false}
				title="新增"
				visible={visible}
				onOk={() => {
					form
						.validateFields()
						.then(values => {
							form.resetFields();
							form.setFieldsValue(values)
							submitMap(values);
						})
						.catch(info => {
							message.error('校验失败：' + info);
							console.log('校验失败:', info);
						});
				}}
				onCancel={onCancel}
				destroyOnClose
			>
				<Form
					form={form}
					{...layout}
					name="Modal create"
					initialValues={{ remember: true }}
					// onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
					preserve={false}
	
				>
					<Form.Item
						label="账户名"
						name="email"
						rules={[
							{ required: true, message: '请输入账户名！' },
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (value) {
										if (/[\u4E00-\u9FA5]/g.test(value)) {
											return Promise.reject('不能输入汉字!');
											//   callback(new Error('只可输入字母、不能输入汉字!'));
										}
									}
									return Promise.resolve();
									//   if (!value || getFieldValue('password') === value) {
									// 	return Promise.resolve();
									//   }
									//   return Promise.reject('The two passwords that you entered do not match!');
								},
							}),
						]}
	
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		);
	}

}

export default CollectionCreateForm;