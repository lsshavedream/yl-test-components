import React, {useContext} from "react";
import {DataManagementContext} from "@/pages/demo/context";
import {Form, Input} from "antd";
import TableComponent from "@/pages/table-component/index";


const ChildrenTable:React.FC = () => {
  const {currentChildTableData,childTableChooseEvent} = useContext(DataManagementContext)

  const childTableClickEvent = (record: any) => {
    childTableChooseEvent(record)
  }

  const peerForm = () => {
    return (
      <>
        <Form.Item name="name" label="名称">
          <Input />
        </Form.Item>
        <Form.Item name="age" label="编码">
          <Input />
        </Form.Item>
        <Form.Item name="unit" label="单位">
          <Input />
        </Form.Item>
        <Form.Item name="price" label="单价">
          <Input />
        </Form.Item>
      </>
    )
  }

  return (
    <TableComponent
      pagination = {false}
      leftClickEvent={childTableClickEvent}
      rowKey='uid'
      size='small'
      peerForm={peerForm}
      childForm={peerForm}
      editForm={peerForm}
      dataSource={currentChildTableData.data}
      columns={currentChildTableData.columns} />
  )
}

export default ChildrenTable
