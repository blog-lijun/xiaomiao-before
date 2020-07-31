import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Form, Input, Select, Button, Table, Space, Row, Card, Col, message, Divider } from 'antd';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';

import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
import { FormInstance } from 'antd/lib/form';
const { Option } = Select;
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
	formRef = React.createRef<FormInstance>();

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
        const { editId } = history.location.query;

        if(editId != undefined){
            this.setState({
                editId: editId
            })
            dispatch({
                type: 'users/userInfo',
                payload:{
                    'user_id' : editId
                },
                callback : (res) => {
                    for(let i in res){
                        if(!Array.isArray(res[i])){
                            res[i] = res[i] + '';
                        } 
                    }

                    this.formRef.current?.setFieldsValue(res)
                    console.log(res.other_role_id,res.other_dept_id);
                    this.formRef.current?.setFieldsValue({
                        'other_role_id[]':res.other_role_id
                    })
                    this.formRef.current?.setFieldsValue({
                        'other_dept_id[]':res.other_dept_id
                    })
                }
            });
        }
       
		dispatch({
			type: 'accounts/allAccounts',
		});
		dispatch({
            type: 'getDept/deptInfo',
            callback: (res) => {
                console.log(res);
            }
        });
		dispatch({
			type: 'roles/getLists',
		});
	}

	// 数据新建
	onCreate = values => {
		const { dispatch } = this.props;
        var type = '';
        if(this.state.editId != ''){
            type = 'users/userEdit';
            values.user_id = this.state.editId;
        } else {
            type = 'users/userAdd';
        }
        console.log(type,values);

		dispatch({
			type: type,
			payload:values,
			callback: (res) => {
                console.log(res);
				if(res.status != undefined && res.status != 500){
					if(res.code == 200){
						this.setState({
                            editId:''
                        });
                        this.formRef.current?.resetFields();
                        message.success({
							content:res.msg,
							className: 'custom-class',
							style: {
								marginTop: '20vh',
                            },
                            onClose: () => {
                                // history.push('/admin/users');
                                history.goBack();
                            }
						});
                        // history.push('/admin/users');
					} else {
						message.error({content:res.msg,
							className: 'custom-class',
							style: {
							  marginTop: '20vh',
							},
						  });
					}
				  }
			}
		});
	};

	render() {
        const { accountInfo,deptInfo,rolesInfo } = this.props;
        const { is_look } = history.location.query;
        
		return (
			<PageContainer>
                <Card>
                <Form  {...layout}
                ref={this.formRef}
                onFinish={this.onCreate}
                // initialValues={usersInfo}
                >
                    <Divider orientation="left">基本信息</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='account_id' style={{}} label="账户名" rules={[{ required: true }]}>
                            <Select disabled={is_look}>
                            {Object.keys(accountInfo).map(v => (
                                <Option key={v}>{accountInfo[v]}</Option>
                            ))}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='number' label="用户编号" rules={[{ required: true }]}>
                                <Input disabled={is_look}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='name' style={{}} label="姓名" rules={[{ required: true }]}>
                            <Input disabled={is_look}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='id_card' label="身份证号" rules={[{ required: true,min:18 }]}>
                                <Input disabled={is_look}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='sex' style={{}} label="性别">
                            <Select disabled={is_look}>
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='status' label="用户状态" rules={[{ required: true }]}>
                                <Select disabled={is_look}>
                                    <Option value="1">在职</Option>
                                    <Option value="2">离职</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='phone' style={{}} label="手机号码" rules={[{ required: true }]}>
                            <Input disabled={is_look}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='company_num' label="公司号码" rules={[{ required: true }]}>
                                <Input disabled={is_look}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left">权限信息</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item  name='dept_id' style={{}} label="部门" rules={[{ required: true }]}>
                            <Select disabled={is_look}>
                                {Object.keys(deptInfo).map(v => (
                                    <Option key={v}>{deptInfo[v]}</Option>
                                ))}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='other_dept_id[]' label="其他部门" >
                            <Select
                                mode="multiple"
                                disabled={is_look}
                                // defaultValue={defaultValue}
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
                            <Select disabled={is_look}>
                                {Object.keys(rolesInfo).map(v => (
                                    <Option key={v}>{rolesInfo[v]}</Option>
                                ))}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='other_role_id[]' label="辅助角色" >
                            <Select
                                disabled={is_look}
                                mode="multiple"
                                // defaultValue={defaultValuesRole}
                            >
                                {Object.keys(rolesInfo).map(v => (
                                    <Option key={v}>{rolesInfo[v]}</Option>
                                ))}
                            </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ width:'100%',textAlign:'center',maxWidth:'100%' }} 
                    wrapperCol={{span:25}}
                    >
                        <Space>
                            <Button disabled={is_look} type="primary" htmlType="submit">
                            保存
                        </Button>
                        <Button onClick={() => {
                            history.goBack();
                        }}>
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

export default connect(({ accounts,users, loading, getDept,roles }: ConnectState) => ({
    // usersInfo: users.usersInfo,
    accountInfo: accounts.allAccounts,
    deptInfo: getDept.dept_info,
    rolesInfo: roles.lists,
    // submitting: loading.effects['login/login'],
}))(Index);
