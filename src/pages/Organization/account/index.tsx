import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Form, Input, Select, Button, Table, Pagination, Row, Card, Col, message  } from 'antd';
import FormCustomizedFormControls from './FormCustomizedFormControls';
import FormSearch from './FormSearch';
import CollectionCreateForm from './modal';

const columns = [
	{
		title: '序号',
		dataIndex: 'id',
		align:'center',
	},
	{
	    title: '账户名',
	    dataIndex: 'name',
	    // render: text => <a>{text}</a>,
		align:'center',

	},
	{
		title: '已关联用户',
		dataIndex:'users',
	    align:'center',
  	},
  	{
	    title: '账户状态',
		dataIndex:'status',
		render: text => {
			return text == 1 ? '启用' : '停用';
		},
    	align:'center',
	},
	{
	    title: '创建时间',
		dataIndex:'created_at',
    	align:'center',
	},
	{
	    title: '创建人',
		dataIndex:'created_by',
    	align:'center',
	},
	{
	    title: '更新时间',
		dataIndex:'updated_at',
    	align:'center',
	},
	{
	    title: '更新人',
		dataIndex:'updated_by',
    	align:'center',
	},
];
const dataSource = [
	{
		id:1,
		name:'zhangsan@niuniubang.com',
		users:'张三（北京公司总裁办）张三（上海公司销售部）',
		status:1,
		created_at:'2020年7月20日13:57:19',
		created_by:'管理员',
		updated_at:'2020年7月20日13:57:38',
		updated_by:'操作员',
	},
	{
		id:2,
		name:'lisi@niuniubang.com',
		users:'李四（天津公司财税部）',
		status:2,
		created_at:'2020年7月20日13:57:19',
		created_by:'管理员',
		updated_at:'2020年7月20日13:57:38',
		updated_by:'操作员',
	},
];



class Index extends Component {
	constructor(props){
        super(props)
        this.state = {
            visible:false,
			currentDetailData:[], // 当前需要传递给子组件的数据，用于显示form表单初始值
			selectedRowKey:'',
        }
    }
    // 弹框显示状态、及当前需要展示的数据赋值
    changeVisible = (status,index) =>{
        this.setState({
            visible:status,
        })
        if(index != undefined){
			console.log(dataSource,index);
            this.setState({
                currentDetailData:dataSource[index]
            })
        }
	}
	
	// 数据新建
	onCreate = values => {
		console.log('form接收数据: ', values);
		this.changeVisible(false);
	};
	//数据编辑
	editData = values => {
		if(values.selectedRowKey == ''){
			message.error('请选择一个账户');
			return false;
		} else {
			this.changeVisible(true,values.selectedRowKey);
		}
	};
	

  render() {
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			this.setState({
				selectedRowKey:`${selectedRowKeys}`
			})
		  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
	  };
    return (
      <PageContainer>
      <Card style={{ marginBottom:10 }}>
  		<FormSearch />
  		</Card>
      	<Card>
			<Row>
		        <Col span={24} style={{ textAlign: 'right' }}>
		          <Button type="primary"
				  onClick={ () => {
					this.changeVisible(true,0);
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
              />
	      	<Table 
	      	style={{paddingTop:10}}
	      	rowSelection={{type:"radio",...rowSelection}}
	      	rowKey={record => record.id}
	      	bordered
	      	size="small"
	      	columns={columns}
	        dataSource={dataSource}
	        pagination
	        />
        </Card>
		
      </PageContainer>
    );
  }
}

export default Index;
