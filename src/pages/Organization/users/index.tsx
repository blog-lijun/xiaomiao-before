import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Form, Input, Select, Button, Table, Pagination, Row, Card, Col, message } from 'antd';
import FormCustomizedFormControls from './FormCustomizedFormControls';
import FormSearch from './FormSearch';
import CollectionCreateForm from './modal';
import { history } from 'umi';

import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
import { UsersModelState } from '@/models/users'

const columns = [
	{
		title: '序号',
		dataIndex: 'id',
		align: 'center',
	},
	{
		title: '账户名',
		dataIndex: 'email',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '姓名',
		dataIndex: 'name',
		// render: text => <a>{text}</a>,
		align: 'center',
	},
	{
		title: '用户状态',
		dataIndex: 'status',
		// render: text => {
		// 	return text == 1 ? '启用' : '停用';
		// },
		align: 'center',
    },
    {
		title: '用户编号',
		dataIndex: 'number',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '性别',
		dataIndex: 'sex',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '身份证号码',
		dataIndex: 'id_card',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '手机号码',
		dataIndex: 'phone',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '公司号码',
		dataIndex: 'company_num',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '部门/其他部门',
		dataIndex: 'dept_id_name',
		// render: text => <a>{text}</a>,
		align: 'center',
    },
    {
		title: '角色/辅助',
		dataIndex: 'role_id_name',
		// render: text => <a>{text}</a>,
		align: 'center',
	},
	{
		title: '创建时间',
		dataIndex: 'created_at',
		align: 'center',
	},
	{
		title: '创建人',
		dataIndex: 'created_by',
		align: 'center',
	},
	{
		title: '更新时间',
		dataIndex: 'updated_at',
		align: 'center',
	},
	{
		title: '更新人',
		dataIndex: 'updated_by',
		align: 'center',
	},
];
const dataSource = [
	{
		id: 1,
		name: 'zhangsan@niuniubang.com',
		users: '张三（北京公司总裁办）张三（上海公司销售部）',
		status: 1,
		created_at: '2020年7月20日13:57:19',
		created_by: '管理员',
		updated_at: '2020年7月20日13:57:38',
		updated_by: '操作员',
	},
	{
		id: 2,
		name: 'lisi@niuniubang.com',
		users: '李四（天津公司财税部）',
		status: 2,
		created_at: '2020年7月20日13:57:19',
		created_by: '管理员',
		updated_at: '2020年7月20日13:57:38',
		updated_by: '操作员',
	},
];

interface MonitorProps extends RouteChildrenProps {
	// 注意，这里的TagType要使用lists作为继承，在connect里面要用到
	lists: Partial<TagType>;
	dispatch: Dispatch<any>;
	loading: boolean;
}

class Index extends Component<MonitorProps> {
	// constructor(props) {
	// 	super(props)
	// 	this.state = {
	// 		visible: false,
	// 		currentDetailData: [], // 当前需要传递给子组件的数据，用于显示form表单初始值
	// 		selectedRowKey: '',
	// 	}
	// }

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
			type: 'account/userInfo',
		});
	}
	// 弹框显示状态、及当前需要展示的数据赋值
	changeVisible = (status, index) => {
		console.log(status,index,this.tableRef);
		this.setState({
			visible: status,
		})

		if (index != undefined && index != 0) {
			this.setState({
				currentDetailData: this.state.selectedRows[0],
				editId: index,
			})
		} else {
			this.setState({
				currentDetailData: [],
				editId: '',
			})
		}
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
		const { lists,users } = this.props;
		console.log(lists,users);
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					selectedRowKey: `${selectedRowKeys}`,
					selectedRows: selectedRows,
				})
				// console.log(`selectedRowKeys: ${selectedRows}`, 'selectedRows: ', selectedRows);
			},
		};
		return (
			<PageContainer>
				<Card style={{ marginBottom: 10 }}>
					<FormSearch />
				</Card>
				<Card>
					<Row>
						<Col span={24} style={{ textAlign: 'right' }}>
							<Button type="primary"
								onClick={() => {
									history.push('/admin/userAdd');
								}}
									>
										新建
							</Button>
							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.editData(this.state);
								}}
							>
								修改
		          			</Button>

							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									form.resetFields();
								}}
							>
								删除
		          			</Button>
							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									form.resetFields();
								}}
							>
								重置密码
		          			</Button>
							<Button
								type="primary"
								style={{ marginLeft: '8px' }}
								onClick={() => {
									form.resetFields();
								}}
							>
								停用/启用
		          			</Button>
						</Col>
					</Row>
					<CollectionCreateForm
						visible={this.state.visible}
						submitMap={this.onCreate}
						onCancel={() => {
							this.changeVisible(false);
						}}
						currentDetailData={this.state.currentDetailData}
						editId={this.state.editId}
						users={users}
					/>
					<Table
						style={{ paddingTop: 10 }}
						rowSelection={{ type: "radio", ...rowSelection }}
						rowKey={record => record.id}
						bordered
						size="small"
						columns={columns}
						dataSource={lists.lists}
						pagination={{ ...this.state.pagination, 
							showSizeChanger: true, 
							showQuickJumper: true,
							showTotal: total => `共${lists.total}条数据`,
							onChange:(current, pageSize) => {
								this.onPageClick(current,pageSize);
							}
						}}
						ref = {this.tableRef}
					/>
				</Card>

			</PageContainer>
		);
	}
}

export default connect(
	({
	  users,
	  loading,
	}: {
	  // 注意这里是model.ts里面定义好的UsersModelState
	  users: UsersModelState;
	  loading: {
		models: { [key: string]: boolean };
	  };
	}) => ({
	  // 这里解读： lists: 命名空间.UsersModelState里面的lists
	  lists: users.lists,
	  // dept_info: getDept.dept_info,
	//   users: users.users,
	  loading: loading.models.getDept,
	}),
	// 最后这里要带上面的class
  )(Index);
// export default Index;