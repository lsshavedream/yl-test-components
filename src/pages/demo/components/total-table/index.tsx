import React, {useContext, useEffect, useRef, useState} from "react";
import {Menu, Table} from "antd";
import {DataManagementContext} from "@/pages/demo/context";
import {useOnClickOutside, useRightClick} from "@/utils/untils";
import styles from "./index.less"

export interface TreeData {
  name: string,
  age: string,
  uid: number,
  children?: TreeData[]
}

const testTreeData: TreeData[] = [
  {
    name: "建筑工程",
    uid: 1,
    age: "1",
    children: [
      {
        name: "主要生产建筑",
        age: "11",
        uid: 2,
        children: [
          {name: "主控通讯楼",age: "111",uid: 3,},
        ]
      },
    ]
  }
]

const TotalTable:React.FC = () => {
  const {mainTableChooseEvent} = useContext(DataManagementContext);

  const [menuShowFlag, setMenuShowFlag] = useState(false);
  const [menuShowLeft, setMenuShowLeft] = useState(0);
  const [menuShowTop, setMenuShowTop] = useState(0);

  const columns = [
    {title: "名称", key: "name", dataIndex: "name", width: 300},
    {title: "编码", key: "age", dataIndex: "age",width: 80},
  ]

  const tableRowClick = (record: any) => {
    return {
      onClick: () => {
        mainTableChooseEvent(record)
      }
    }
  }

  const TableMenu = () => {
    const ref = useRef();

    useOnClickOutside(ref, () => {
      setMenuShowFlag(false);
    })

    return (
      <div ref={ref} className={styles.cyMenu} style={{left: `${menuShowLeft}px`,top:`${menuShowTop}px`}}>
        <Menu>
          <Menu.Item>
            上移
          </Menu.Item>
          <Menu.Item>
            下移
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  const TableTrComponent = ({...rest}) => {
    const ref = useRef();

    const rowContextMenuEvent = (event: any) => {
      setMenuShowFlag(true);
      setMenuShowLeft(event.clientX)
      setMenuShowTop(event.clientY)
    }

    useRightClick(ref, (event) => {
      rowContextMenuEvent(event)
    })

    return (
      <tr ref={ref} {...rest} />
    )
  }

  const components = {
    body: {
      row: TableTrComponent,
    }
  }

  return (
    <div className='totalTable'>
      <Table
        onRow={tableRowClick}
        pagination={false}
        components={components}
        rowKey="uid"
        size="small"
        dataSource={testTreeData}
        columns={columns} />
      {menuShowFlag ? <TableMenu /> : null}
    </div>
  )
}

export default TotalTable
