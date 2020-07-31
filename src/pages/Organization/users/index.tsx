import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Form, Input, Select, Button, Table, Pagination, Row, Card, Col, message } from 'antd';
import FormCustomizedFormControls from './FormCustomizedFormControls';
import FormSearch from './FormSearch';
import UpdateLog from '../updateLog';
import CollectionCreateForm from './modal';
import { history } from 'umi';
import Authorized from '@/utils/Authorized';

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
		visibleLog: false,
		currentDetailData: [], // 当前需要传递给子组件的数据，用于显示form表单初始值
		selectedRowKeys: [],
		selectedRows: [],
		pagination: { pageSize:10 },
		editId: '',
		search: {},
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

	//数据编辑
	editData = (values,is_look) => {
		if (`${values.selectedRowKeys}` == '') {
			message.error('请选择一个账户');
			return false;
		} else {
			var url = '';
			if(is_look){
				url = '/admin/userAdd?editId='+`${values.selectedRowKeys}`+'&is_look='+is_look;
			} else {
				url = '/admin/userAdd?editId='+`${values.selectedRowKeys}`
			}
			// this.changeVisible(true, values.selectedRowKey);
			history.push(url);
		}
	};
	onPageClick = (current,pagesize) => {
		const { dispatch } = this.props;
		// console.log(current,pagesize);
		var params = this.state.search;
		params['offset'] = current;
		params['limit'] = pagesize;
		dispatch({
			type: 'users/getLists',
			payload:params
		});
	};
	upStatus = (values, type) => {
		if (`${values.selectedRowKeys}` == '') {
			message.error('请选择一个账户');
			return false;
		}
		// var params = {
		// 	user_id:values.selectedRowKey
		// };
		var params = values.selectedRows[0];
		params['user_id'] = `${values.selectedRowKeys}`;
		var url = 'users/userEdit';
		if(type == 'status'){//修改状态
			let statusReturn;
			statusReturn = values.selectedRows[0].status == "在职" ? 2 : 1;
			params['status'] = statusReturn;
			url = 'users/userEdit';
		}
		const { dispatch } = this.props;
		dispatch({
			type: url,
			payload: params,
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
						if(type == 'status'){
							this.setState({
								selectedRowKeys: [],
								selectedRows: [],
							});
						}
						
						dispatch({
							type: 'users/getLists',
						});
						// this.componentDidMount();
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

	resetSearch = () => {
		this.setState({
			search: {},
		});
	}

	searchLists = values => {
		this.setState({
			search:values
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'users/getLists',
			payload: values
		});
	}

	modalCancel = (status) => {
		this.setState({
			visibleLog: status,
		})
	}

  modalLog = () => {
    var selectedKeys = this.state.selectedRowKeys;
    if (JSON.stringify(selectedKeys) === "[]"){
      message.error({
        content: '请先选择一个用户！',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    } 
    const { dispatch } = this.props;
    dispatch({
      type: 'updateLog/getLists',
      payload: {
        type:3,
        o_id: selectedKeys,
      },
      callback: (res) => {
        // console.log(res);return false;
        this.setState({ 
		visibleLog: true,
          modalLists: res,
        });
      }
    });
  } 

	render() {
		const { lists,users } = this.props;
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					selectedRowKeys: selectedRowKeys,
					selectedRows: selectedRows,
				})
				// console.log(`selectedRowKeys: ${selectedRows}`, 'selectedRows: ', selectedRows);
			},
		};
		return (
			<PageContainer>
				<Card style={{ marginBottom: 10 }}>
					<FormSearch searchLists={this.searchLists} resetSearch={this.resetSearch} />
				</Card>
				<UpdateLog visible={this.state.visibleLog} 
				onCancel={() => {
					this.setState({
					visibleLog: status,
					modalLists:{},
					})
				}} 
				modalLists={this.state.modalLists}
				/>
				<Card>
					<Row>
						<Col span={24} style={{ textAlign: 'right' }}>
						<Authorized authority="system_ctl_users_add" noMatch={null}>

							<Button type="primary"
								onClick={() => {
									history.push('/admin/userAdd');
								}}
									>
										新建
							</Button>
						</Authorized>
						<Authorized authority="system_ctl_users_edit" noMatch={null}>

							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.editData(this.state, false);
								}}
							>
								修改
		          			</Button>
						</Authorized>
						
						<Authorized authority="system_ctl_users_look" noMatch={null}>

							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.editData(this.state, true);
								}}
							>
								查看
		          			</Button>
						</Authorized>
							<Button
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.modalLog();
								}}
							>
								修改日志
		          			</Button>

							<Button
								type="primary"
								style={{ marginLeft: '8px' }}
								onClick={() => {
									this.upStatus(this.state, 'status');
								}}
							>
								在职/离职
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
