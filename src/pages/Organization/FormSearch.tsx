import React, { Component } from 'react';
import { Form, Input, Select, Button, Table, Pagination, Row, Col  } from 'antd';

class FormSearch extends Component{
	render(){
		return (
			<Form
			name="advanced_search"
      		className="ant-advanced-search-form"
			>
				<Row gutter={24}>
					<Form.Item
	        		label="账户名"
	        		name="name"
	        		style={{ paddingLeft:8,paddingRight:8	 }}
	        		>
			        	<Input placeholder="账户名" />
			        </Form.Item>

					<Form.Item
	        		label="状态"
	        		name="status"
	        		>
					<Select  style={{ width: 120,paddingLeft:8,paddingRight:8	 }} >
				      <Option value="">请选择</Option>
				      <Option value="1">启用</Option>
				      <Option value="2">停用</Option>
				    </Select>
				    </Form.Item>

				</Row>
				<Row>
			        <Col span={24} style={{ textAlign: 'right' }}>
			          <Button type="primary" htmlType="submit">
			            搜索
			          </Button>
			          <Button
			            style={{ margin: '0 8px' }}
			            onClick={() => {
			              form.resetFields();
			            }}
			          >
			            重置
			          </Button>
			        </Col>
	      		</Row>
			</Form>
		);
	};
}

export default FormSearch;