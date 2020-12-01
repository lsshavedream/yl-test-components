import React, {useContext} from "react";
import {DataManagementContext} from "@/pages/demo/context";
import TableComponent from "@/pages/table-component/index";

const ChildrenTable:React.FC = () => {
  const {currentChildTableData,childTableChooseEvent} = useContext(DataManagementContext)

  const childTableClickEvent = (record: any) => {
    return {
      onClick: () => {
        childTableChooseEvent(record)
      }
    }
  }

  return (
    <TableComponent
      pagination = {false}
      onRow={childTableClickEvent}
      rowKey='uid'
      size='small'
      dataSource={currentChildTableData.data}
      columns={currentChildTableData.columns} />
  )
}

export default ChildrenTable
