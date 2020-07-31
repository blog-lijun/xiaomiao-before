import React, { Component,useState } from 'react';
import { Table,Modal,Button } from 'antd';


const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};


const UpdateLog = ({ visible, onCancel, modalLists }) => {
    const columns = [
        {
            title: '类型',
            dataIndex: 'status',
            align: 'center',
        },
        {
            title: '修改内容',
            dataIndex: 'remark',
            // render: text => <a>{text}</a>,
            align: 'center',
    
        },
        {
            title: '操作人',
            dataIndex: 'created_by',
            align: 'center',
        },
        {
            title: '操作时间',
            dataIndex: 'created_at',
            align: 'center',
        },
    ];
        return (
            <Modal
          title="修改日志"
          visible={visible}
		  onCancel={onCancel}
          destroyOnClose
          width="700px"
          footer={[
            <Button key="back" onClick={onCancel}>
            取消
          </Button>,
          ]}
        >
            <Table columns={columns} dataSource={modalLists} />
        </Modal>
        );
}

export default UpdateLog;