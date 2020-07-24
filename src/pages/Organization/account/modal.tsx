import React, { Component,useState } from 'react';
import { Form, Modal, Input, Button } from 'antd';


const onFinish = values => {
	console.log('Success:', values);
};

const onFinishFailed = errorInfo => {
	console.log('Failed:', errorInfo);
};

const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};


const CollectionCreateForm = ({ visible, submitMap, onCancel, currentDetailData }) => {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    };
    let initValues = currentDetailData == undefined || currentDetailData.length == 0 ? {} :
            {
                name:currentDetailData.name,
                crs:currentDetailData.crs,
            }
            
    form.setFieldsValue(initValues)
	// state = { visible: false };

    // handleOk = e => {
	// 	console.log(e);
	// 	this.setState({
	// 	  visible: false,
	// 	});
	//   };
	
	//   handleCancel = e => {
	// 	console.log(e);
	// 	this.setState({
	// 	  visible: false,
	// 	});
	//   };
        return (
            <Modal
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
					label="Username"
					name="username"
					rules={[{ required: true, message: '请输入账户名！' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item {...tailLayout}>
					{/* <Button type="primary" htmlType="submit">
					Submit
					</Button> */}
			</Form.Item>
			</Form>
        </Modal>
        );
}

export default CollectionCreateForm;