import React, {useEffect, useRef, useState} from "react";
import {Menu, Table} from "antd";
import {flatten, toTreeData, useOnClickOutside, useRightClick} from "@/utils/untils";
import styles from "@/pages/table-component/index.less";

interface WrapperTableProps {
  // 获取数据的url
  url?: string
  // 获取数据获得的额外的参数
  extraParams?: object
  // 更新数据的url
  controlDataUrl?: string
  // 是否使用本地数据
  useLocalData?: boolean
  // 使用的本地数据
  dataSource?: object[]
  // 上移的回调函数
  upCallback?: () => void
  // 下移的回调函数
  downCallback?: () => void
  // 升级的回调函数
  upgradeCallback?: () => void
  // 降级的回调函数
  downgradeCallback?: () => void
  // 新增同级
  addCallback?: () => void
  // 新增子级
  addChildrenCallback?: () => void
  // 删除回调
  deleteCallback?: () => void
  // columns
}

const wrapperTable = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (props: P & WrapperTableProps) => {
  const {dataSource, ...restProps} = props;

  const [menuShowFlag, setMenuShowFlag] = useState<boolean>(false);
  const [menuShowLeft, setMenuShowLeft] = useState<number>(0);
  const [menuShowTop, setMenuShowTop] = useState<number>(0);
  const [currentControlData, setCurrentControlData] = useState({uid: 3});
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [finallyDataSource, setFinallyDataSource] = useState<object[]>([]);

  const TableRightMenu = () => {
    const ref = useRef(null);

    useOnClickOutside(ref, () => {
      setMenuShowFlag(false);
    })

    const upEvent = () => {
      const flattenData = flatten(finallyDataSource);
      const parentUId = currentControlData.parentId;
      const uId = currentControlData.uid;
      // 没有parentId 就代表是第一级的任务，操作源数据就行。
      if(!parentUId) {

      }else {
        // 用parentUId 去寻找父亲下的children，然后寻找同级元素
        const parentData = flattenData.find((item) => item.uid === parentUId);
        const childrenData = parentData.children;
        const currentDataIndex = childrenData.findIndex((item) => item.uid === uId);
        const nextData = childrenData[currentDataIndex - 1].uid;

        const currentIndex = flattenData.findIndex((item) => item.uid === uId);
        const nextIndex = flattenData.findIndex((item) => item.uid === nextData);

        flattenData.splice(currentIndex,1,...flattenData.splice(nextIndex,1,flattenData[currentIndex]))

        setFinallyDataSource(toTreeData(flattenData))

      }
      setMenuShowFlag(false);
    }

    return (
      <div ref={ref} className={styles.tableMenu} style={{left: `${menuShowLeft}px`,top:`${menuShowTop}px`}}>
        <Menu>
          <Menu.Item>
            <div onClick={() => upEvent()}>
              上移
            </div>
          </Menu.Item>
          <Menu.Item>
            下移
          </Menu.Item>
        </Menu>
      </div>
    )
  }



  const currentTrClickEvent = (uId: string) => {
    const flattenData = flatten(dataSource);
    const data = flattenData.find((item) => item.uid === uId);
    setCurrentControlData(data)
  }

  const TableTrComponent = ({className, ...rest }) => {
    const uid = rest["data-row-key"];

    let trClassName = `${className}`;

    const ref = useRef(null);

    const rowContextMenuEvent = (event: any) => {
      setMenuShowFlag(true);
      setMenuShowLeft(event.clientX)
      setMenuShowTop(event.clientY)
    }

    useRightClick(ref, (event) => {
      rowContextMenuEvent(event)
      currentTrClickEvent(uid)
    })

    if(currentControlData.uid && currentControlData.uid === uid) {
      trClassName = `${className} activeTr`
    }

    return (
      <tr ref={ref} {...rest} className={trClassName} />
    )
  }

  const components = {
    body: {
      row: TableTrComponent,
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  useEffect(() => {
    setFinallyDataSource(dataSource!)
  },[dataSource])

  return (
    <div className = {styles.wrapTable}>
      <WrapperComponent
        dataSource={finallyDataSource}
        components={components}
        rowSelection={{ ...rowSelection, checkStrictly }}
        {...restProps as P} />
      {menuShowFlag ? <TableRightMenu /> : null}
    </div>
  )
}

export default wrapperTable(Table)



