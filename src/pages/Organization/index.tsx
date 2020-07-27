import React, { Component } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Tree, Input, Card, Form, Button, Select } from 'antd';

import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { TagType } from './data';
import { StateType } from '@/models/organization'
import { FormInstance } from 'antd/lib/form';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 6 },
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
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const onFinish = values => {
  console.log(values);
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
  };

  componentDidMount() {
    this.loadData();
  }

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    remark: '',
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

  onSelect = (selectedKeys, e) => {
    const { dispatch } = this.props;
    console.log(this.props);
    dispatch({
      type: 'getDept/deptInfo',
      payload: {
        'dept_id': `${selectedKeys}`,
      },
      callback: (res) => {
        this.formRef.current.setFieldsValue({
          name:res.name,
          type:res.type,
        });
        console.log(res,'34324234');
      },
    });
  };

  onChangeReamark = ({ target: { value } }) => {
    this.setState({ remark:value });
    console.log(this.state);
  };


  render() {

    const { tags } = this.props;
    const generateList = data => {
      if(data.length > 0){
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
        <Card>
          <div style={{ width: '20%', display: 'inline-block' }}>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
            <Tree
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(tags)}
              onSelect={this.onSelect}
            />
          </div>
          <Form ref={this.formRef} style={{ width: '50%', textAlign: 'center', display: 'inline-table' }} {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item name='type' style={{}} label="组织机构类型" rules={[{ required: true }]}>
              <Select >
                <Option value="1">部门</Option>
                <Option value="2">分公司</Option>
              </Select>
            </Form.Item>
            <Form.Item name='name' label="名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['dept', 'parent_id']} label="上级部门" rules={[{ required: true }]}>
              <Select >
                <Option value="1">部门</Option>
                <Option value="2">分公司</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['dept', 'user_id']} label="部门负责人" rules={[{}]}>
              <Select >
                <Option value="1">部门</Option>
                <Option value="2">分公司</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['dept', 'parent_user_id']} label="上级负责人" rules={[{}]}>
              <Select >
                <Option value="1">部门</Option>
                <Option value="2">分公司</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['dept', 'remark']} label="备注" rules={[{}]}>
              <TextArea
                value={remark}
                onChange={this.onChangeReamark}
                placeholder="备注"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                保存
            </Button>
            </Form.Item>
          </Form>
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
    // 注意这里是model.ts里面定义好的StateType
    getDept: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    // 这里解读： tags: 命名空间.StateType里面的tags
    tags: getDept.tags,
    loading: loading.models.getDept,
  }),
  // 最后这里要带上面的class
)(SearchTree);
// export default SearchTree;
