import React, { Component, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Tree, Input, Card, Form, Button, Select, Row, Col, message } from 'antd';
import request from '@/utils/request';

import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
import { OrganizationModel } from '@/models/organization'
import { FormInstance } from 'antd/lib/form';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};



const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const validateMessages = {
  required: '${label} 不能为空!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};


interface MonitorProps extends RouteChildrenProps {
  // 注意，这里的TagType要使用tags作为继承，在connect里面要用到
  tags: Partial<TagType>;
  dispatch: Dispatch<any>;
  loading: boolean;
}
const dataList = [];


class SearchTree extends React.Component<MonitorProps> {

  loadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'getDept/treeList',
    });
    dispatch({
      type: 'getDept/deptInfo',
      callback: (res) => {
        
        this.setState({
          depts: res
        })
      }
    });
    dispatch({
      type: 'getDept/userInfo',
    });

  };

  componentDidMount() {
    this.loadData();
  }


  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    remark: '',
    is_disabled: true,
    depts: {},
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.props.tags);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  formRef = React.createRef<FormInstance>();
  treeRef = React.createRef();

  isNull = (str) => {
    if (str == null || str == '' || str == undefined) {
      return true;
    } else {
      return false;
    }
  };

  onSelect = (selectedKeys, e) => {
    const { dispatch } = this.props;
    this.setState({
      is_disabled: true,
    });
    dispatch({
      type: 'getDept/deptInfo',
      payload: {
        'dept_id': `${selectedKeys}`,
      },
      callback: (res) => {
        if (res == '' || res == null || res == undefined) {
          this.formRef.current?.resetFields();
        } else {
          this.formRef.current.setFieldsValue({
            name: res.name,
            type: this.isNull(res.type) ? '' : (res.type).toString(),
            parent_id: this.isNull(res.parent_id) ? '' : (res.parent_id).toString(),
            user_id: this.isNull(res.user_id) ? '' : (res.user_id).toString(),
            parent_user_id: this.isNull(res.parent_user_id) ? '' : (res.parent_user_id).toString(),
            remark: res.remark,
            dept_number: res.dept_number,
          });
        }
      },
    });
  };

  onChangeReamark = ({ target: { value } }) => {
    this.setState({ remark: value });
    console.log(this.state);
  };

  addDept = () => {
    // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    // setSelectedKeys([]);
    if (this.treeRef.current != null) {
      this.treeRef.current.state.selectedKeys = [];
    }
    this.formRef.current?.resetFields();
    this.setState({ is_disabled: false });
  };
  editDept = () => {
    let selectedKeys = this.treeRef.current.state.selectedKeys;
    if (JSON.stringify(selectedKeys) === "[]"){
      message.error({
        content: '请先选择一个部门！',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    } 
    this.setState({ is_disabled: false });
  }
  deleteDept = () => {
    let selectedKeys = this.treeRef.current.state.selectedKeys;

    var values = this.formRef.current?.getFieldsValue();

    if (JSON.stringify(selectedKeys) === "[]"){
      message.error({
        content: '请先选择一个部门！',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      });
      return false;
    } 
    const { dispatch } = this.props;
    values.dept_id = `${selectedKeys}`;
    values.status = 2;
    dispatch({
      type: 'getDept/deptEdit',
      payload: values,
      callback: (res) => {
        if(res.code == 200){
          message.success({
            content: '成功',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
          dispatch({
            type: 'getDept/treeList',
          });
          if (this.treeRef.current != null) {
            this.treeRef.current.state.selectedKeys = [];
          }
          this.formRef.current?.resetFields();
          this.setState({ is_disabled: true });
        } else {
          if(res.status != undefined && res.status != 500){
            message.error({content:res.msg,
              className: 'custom-class',
              style: {
                marginTop: '20vh',
              },
            });
          }
          // console.log(res);
          
        }
      },
    });
  }

  onFinish = values => {
    const { dispatch } = this.props;
    let selectedKeys = this.treeRef.current.state.selectedKeys;
    var type = '';
    var content = '';
    if(this.isNull(selectedKeys)){
      type = 'getDept/deptAdd';
      content = '添加';
    } else {
      values.dept_id = `${selectedKeys}`;
      type = 'getDept/deptEdit';
      content = '编辑';
    }
    values.status = 1;
    dispatch({
      type: type,
      payload: values,
      callback: (res) => {
        if(res.code == 200){
          message.success({
            content: content + '成功',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
          dispatch({
            type: 'getDept/treeList',
          });
          if (this.treeRef.current != null) {
            this.treeRef.current.state.selectedKeys = [];
          }
          this.formRef.current?.resetFields();
          this.setState({ is_disabled: true });
        } else {
          if(res.status != undefined && res.status != 500){
            message.error({content:res.msg,
              className: 'custom-class',
              style: {
                marginTop: '20vh',
              },
            });
          }
          // console.log(res);
          
        }
      },
    });
  };


  render() {
    const { tags, users } = this.props;
    const generateList = data => {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key, title } = node;
          dataList.push({ key, title: title });
          if (node.children) {
            generateList(node.children);
          }
        }
      }

    };
    const { remark } = this.state;

    generateList(tags);
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.length > 0 ?
        data.map(item => {
          const index = item.title.indexOf(searchValue);
          const beforeStr = item.title.substr(0, index);
          const afterStr = item.title.substr(index + searchValue.length);
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span className="site-tree-search-value">{searchValue}</span>
                {afterStr}
              </span>
            ) : (
                <span>{item.title}</span>
              );
          if (item.children) {
            return { title, key: item.key, children: loop(item.children) };
          }

          return {
            title,
            key: item.key,
          };
        }) : '';
    return (
      <>
        <div style={{ textAlign: 'right', paddingBottom: '20px' }}>
          <Button style={{ margin: '0 5px' }} onClick={this.addDept} type="primary">新建</Button>
          <Button style={{ margin: '0 5px' }} onClick={this.editDept} type="primary">修改</Button>
          <Button style={{ margin: '0 5px' }} onClick={this.deleteDept} type="primary">删除</Button>
          {/* <Button style={{ margin: '0 5px' }} type="primary">修改日志</Button> */}
          {/* <Button style={{ margin: '0 5px' }} type="primary">停用/启用</Button> */}
        </div>

        <Card>
          <Row>
            <Col span={18} push={6}>
              <Form ref={this.formRef} style={{ paddingLeft: '5%', width: '70%', textAlign: 'center', display: 'inline-table' }} {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                <Row>
                  <Col span={12}>
                    <Form.Item name='type' style={{}} label="组织机构类型" rules={[{ required: true }]}>
                      <Select disabled={this.state.is_disabled} >
                        <Option value="1">部门</Option>
                        <Option value="2">分公司</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='dept_number' label="编码" rules={[{ required: true }]}>
                      <Input disabled={this.state.is_disabled} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item name='name' label="名称" rules={[{ required: true }]}>
                      <Input disabled={this.state.is_disabled} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='parent_id' label="上级部门" rules={[{ required: true }]}>
                      <Select disabled={this.state.is_disabled} >
                        {Object.keys(this.state.depts).map(v => (
                          <Option key={v}>{this.state.depts[v]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item name='user_id' label="部门负责人" rules={[{}]}>
                      <Select disabled={this.state.is_disabled} >
                        {Object.keys(users).map(v => (
                          <Option key={v}>{users[v]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name='parent_user_id' label="上级负责人" rules={[{}]}>
                      <Select disabled={this.state.is_disabled} >
                        {Object.keys(users).map(v => (
                          <Option key={v}>{users[v]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name='remark' labelCol={{ span:4 }} wrapperCol={{ span:20 }} label="备注" rules={[{}]}>
                  <TextArea disabled={this.state.is_disabled}
                    value={remark}
                    onChange={this.onChangeReamark}
                    placeholder="备注"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>

                <Form.Item style={{ width:'100%' }} >
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={6} pull={18}>
              <div /*style={{ width: '20%', display: 'inline-block' }}*/>
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  treeData={loop(tags)}
                  onSelect={this.onSelect}
                  ref={this.treeRef}
                />
              </div>
            </Col>
          </Row>


        </Card>
      </>
    );
  }
}

export default connect(
  ({
    getDept,
    loading,
  }: {
    // 注意这里是model.ts里面定义好的OrganizationModel
    getDept: OrganizationModel;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    // 这里解读： tags: 命名空间.OrganizationModel里面的tags
    tags: getDept.tags,
    // dept_info: getDept.dept_info,
    users: getDept.users,
    loading: loading.models.getDept,
  }),
  // 最后这里要带上面的class
)(SearchTree);
// export default SearchTree;
