import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table,  Row, Card, Col, message } from 'antd';
import FormSearch from './FormSearch';
import CollectionCreateForm from './modal';

import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
import { AccountType } from '@/models/account'

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
		title: '已关联用户',
		dataIndex: 'account_users',
		align: 'center',
	},
	{
		title: '账户状态',
		dataIndex: 'status',
		render: text => {
			return text == 1 ? '启用' : '停用';
		},
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
		search: {},
	};
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'accounts/getLists',
		});
		dispatch({
			type: 'accounts/userInfo',
		});
	}
	// 弹框显示状态、及当前需要展示的数据赋值
	changeVisible = (status, index) => {
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
				selectedRowKey: '',
				selectedRows: [],
			})
		}
	}

	// 数据新建
	onCreate = values => {
		const { dispatch } = this.props;
		// console.log(this.state,values);return false;
		var type = '';
		if(this.state.selectedRowKey == ''){
			type = 'accounts/accountAdd';
		} else {
			type = 'accounts/accountEdit'
			values.account_id = this.state.selectedRowKey
		}
		// console.log(values);return false;
		dispatch({
			type: type,
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
						this.setState({
							selectedRowKey: '',
							selectedRows: [],
							editId: '',
						});
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
		// console.log(values);
		if (values.selectedRowKey == '') {
			message.error('请选择一个账户');
			return false;
		} else {
			this.changeVisible(true, values.selectedRowKey);
		}
	};
	resetSearch = () => {
		this.setState({
			search: {},
		});
	}
	onPageClick = (current,pagesize) => {
		const { dispatch } = this.props;
		// console.log();
		var params = this.state.search;
		params['offset'] = current;
		params['limit'] = pagesize;
		dispatch({
			type: 'accounts/getLists',
			payload:params
		});
	};

	searchLists = values => {
		const { dispatch } = this.props;
		this.setState({
			search:values
		});
		dispatch({
			type: 'accounts/getLists',
			payload: values
		});
	}

	upStatus = (values, type) => {
		if (values.selectedRowKey == '') {
			message.error('请选择一个账户');
			return false;
		}
		var params = {
			account_id:values.selectedRowKey
		};
		var url = 'accounts/accountEdit';
		if(type == 'status'){//修改状态
			params['status'] = values.selectedRows[0].status == 1 ? 2 : 1;
		} else if(type == 'delete'){
			params['delete'] = 2;
		} else if(type == 'resetPassword'){
			url = 'accounts/pwdReset';
		}
		const { dispatch } = this.props;
		dispatch({
			type: url,
			payload: params,
			callback: (res) => {
				console.log(res);
				if(res.status != undefined && res.status != 500){
					if(res.code == 200){
						message.success({
							content:res.msg,
							className: 'custom-class',
							style: {
								marginTop: '20vh',
							},
						});
						this.setState({
							selectedRowKey: [],
							selectedRows: {},
						})
						dispatch({
							type: 'accounts/getLists',
						});
						
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
	onSelectChange = (selectedRowKeys, selectedRows) => {
			this.setState({
				selectedRowKey: `${selectedRowKeys}`,
				selectedRows: selectedRows,
			})
			// console.log(`selectedRowKeys: ${selectedRows}`, 'selectedRows: ', selectedRows);
		};

	render() {
		const { lists,users } = this.props;
		// console.log(users);
		const { selectedRowKey } = this.state;
		const rowSelection = {
			selectedRowKey,
			onChange: this.onSelectChange,
			// onChange: (selectedRowKeys, selectedRows) => {
			// 	this.setState({
			// 		selectedRowKey: `${selectedRowKeys}`,
			// 		selectedRows: selectedRows,
			// 	})
			// 	// console.log(`selectedRowKeys: ${selectedRows}`, 'selectedRows: ', selectedRows);
			// },
		};
		return (
			<PageContainer>
				<Card style={{ marginBottom: 10 }}>
					<FormSearch searchLists={this.searchLists} resetSearch={this.resetSearch} />
				</Card>
				<Card>
					<Row>
						<Col span={24} style={{ textAlign: 'right' }}>
							<Button type="primary"
								onClick={() => {
									this.changeVisible(true, 0);
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
									this.upStatus(this.state, 'delete');
								}}
							>
								删除
		          			</Button>
							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.upStatus(this.state, 'resetPassword');
								}}
							>
								重置密码
		          			</Button>
							<Button
								type="primary"
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.upStatus(this.state, 'status');
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
						// ref={this.tableRef}
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
						
					/>
				</Card>

			</PageContainer>
		);
	}
}

export default connect(
	({
	  accounts,
	  loading,
	}: {
	  // 注意这里是model.ts里面定义好的AccountType
	  accounts: AccountType;
	  loading: {
		models: { [key: string]: boolean };
	  };
	}) => ({
	  // 这里解读： lists: 命名空间.AccountType里面的lists
	  lists: accounts.lists,
	  // dept_info: getDept.dept_info,
	  users: accounts.users,
	  loading: loading.models.getDept,
	}),
	// 最后这里要带上面的class
  )(Index);
// export default Index;
