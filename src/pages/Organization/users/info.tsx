import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Form, Input, Select, Button, Table, Space, Row, Card, Col, message, Divider } from 'antd';
import FormCustomizedFormControls from './FormCustomizedFormControls';
import FormSearch from './FormSearch';
import CollectionCreateForm from './modal';
import { ConnectState } from '@/models/connect';


import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
// import { StateType } from '@/models/users'


interface MonitorProps extends RouteChildrenProps {
	// 注意，这里的TagType要使用lists作为继承，在connect里面要用到
	lists: Partial<TagType>;
	dispatch: Dispatch<any>;
	loading: boolean;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};


class Index extends Component<MonitorProps> {
	tableRef = React.createRef();

	state = {
		visible: false,
		currentDetailData: [], // 当前需要传递给子组件的数据，用于显示form表单初始值
		selectedRowKey: '',
		selectedRows: [],
		pagination: { pageSize:10 },
        editId: '',
	};
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'users/getLists',
		});
		dispatch({
			type: 'accounts/allAccounts',
		});
		dispatch({
			type: 'getDept/deptInfo',
		});
	}

	// 数据新建
	onCreate = values => {
		const { dispatch } = this.props;
		console.log(this.state,values);return false;
		dispatch({
			type: 'account/accountAdd',
			payload:values,
			callback: (res) => {
				if(res.status != undefined && res.status != 500){
					if(res.code == 200){
						message.success({
							content:res.msg,
							className: 'custom-class',
							style: {
								marginTop: '20vh',
							},
						});
						this.changeVisible(false);
						this.componentDidMount();
					} else {
						message.error({content:res.msg,
							className: 'custom-class',
							style: {
							  marginTop: '20vh',
							},
						  });
					}
				  }
			},
		});
	};
	//数据编辑
	editData = values => {
		console.log(values);
		if (values.selectedRowKey == '') {
			message.error('请选择一个账户');
			return false;
		} else {
			this.changeVisible(true, values.selectedRowKey);
		}
	};
	onPageClick = (current,pagesize) => {
		const { dispatch } = this.props;
		// console.log(current,pagesize);
		dispatch({
			type: 'account/getLists',
			params:{
				'offset' : current,
				'limit' : pagesize,
			}
		});
	};


	render() {
		const { lists,accountInfo,deptInfo } = this.props;
        console.log(this.props);
		return (
			<PageContainer>
                <Card>
                <Form  {...layout}>
                    <Divider orientation="left">基本信息</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='account_id' style={{}} label="账户名" rules={[{ required: true }]}>
                            <Select>
                            {Object.keys(accountInfo).map(v => (
                                <Option key={v}>{accountInfo[v]}</Option>
                            ))}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='number' label="用户编号" rules={[{ required: true }]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='name' style={{}} label="姓名" rules={[{ required: true }]}>
                            <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='id_card' label="身份证号" rules={[{ required: true,min:18 }]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='sex' style={{}} label="性别" rules={[{  }]}>
                            <Select>
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='status' label="用户状态" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="1">在职</Option>
                                    <Option value="2">离职</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='phone' style={{}} label="手机号码" rules={[{ required: true }]}>
                            <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='company_num' label="公司号码" rules={[{ required: true }]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left">权限信息</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='dept_id' style={{}} label="部门" rules={[{ required: true }]}>
                            <Select>
                                {Object.keys(deptInfo).map(v => (
                                    <Option key={v}>{deptInfo[v]}</Option>
                                ))}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='other_dept_id' label="其他部门" >
                            <Select
                                mode="multiple"
                            >
                                {Object.keys(deptInfo).map(v => (
                                    <Option key={v}>{deptInfo[v]}</Option>
                                ))}
                            </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='role_id' style={{}} label="角色" rules={[{ required: true }]}>
                            <Select>
                                <Option value="1">部门</Option>
                                <Option value="2">分公司</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='other_role_id' label="辅助角色" >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ width:'100%',textAlign:'center',maxWidth:'100%' }} >
                        <Space>
                            <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button>
                            取消
                        </Button>
                        </Space>
                        
                    </Form.Item>
                </Form>
                </Card>

			</PageContainer>
		);
	}
}

export default connect(({ accounts,users, loading, getDept }: ConnectState) => ({
    lists: users.lists,
    accountInfo: accounts.allAccounts,
    deptInfo: getDept.dept_info
    // submitting: loading.effects['login/login'],
}))(Index);
