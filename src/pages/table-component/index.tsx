import React, { useEffect, useRef, useState, useMemo } from "react";
import { Menu, message, Table, Modal, Form } from "antd";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons"
import { flatten, toTreeData, useOnClickOutside, useRightClick } from "@/utils/untils";
import styles from "@/pages/table-component/index.less";
import SmallIcon from "@/components/small-icon";
import Item from "antd/lib/list/Item";

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
  dataSource?: TableDataItem[]
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
  getCurrentControlData?: (currentControlData: any) => void
  // 新增同级节点的表单
  peerForm?: () => React.ReactNode
  // 新增子级节点的表单
  childForm?: () => React.ReactNode
  // 编辑数据的表单
  editForm?: () => React.ReactNode
  // 鼠标左键的点击事件
  leftClickEvent?: (record: HandleTableDataItem) => void
}

interface TableDataItem {
  children?: TableDataItem[]
  uid: string | number
}

export interface HandleTableDataItem extends TableDataItem {
  parentId: string | number
}

const wrapperTable = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (props: P & WrapperTableProps) => {
  const { dataSource, peerForm, childForm, editForm, leftClickEvent, ...restProps } = props;

  const [menuShowFlag, setMenuShowFlag] = useState<boolean>(false);
  const [menuShowLeft, setMenuShowLeft] = useState<number>(0);
  const [menuShowTop, setMenuShowTop] = useState<number>(0);
  const [currentControlData, setCurrentControlData] = useState<HandleTableDataItem>({ uid: "", parentId: "" });
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [finallyDataSource, setFinallyDataSource] = useState<HandleTableDataItem[]>([]);

  const [peerModalVisible, setPeerModalVisible] = useState<boolean>(false);
  const [childModalVisible, setChildModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  // 新增同级节点的表单
  const [addPeerForm] = Form.useForm();
  // 嫌憎子级节点的表单
  const [addChildForm] = Form.useForm();
  // 编辑节点数据的表单
  const [editNodeForm] = Form.useForm();

  const flattenData = useMemo(() => {
    return flatten(finallyDataSource)
  }, [JSON.stringify(finallyDataSource)]);

  // 上移功能的权限判断
  const upJurisdiction = useMemo(() => {

    if (!currentControlData.uid) {
      return false
    }

    // 先判断当前数据有没有parentId, 有就代表第一级，用finalyDataSource判断是不是有上一个兄弟节点
    const parentUId = currentControlData.parentId;
    if (!parentUId) {
      const judgeData = JSON.parse(JSON.stringify(finallyDataSource));
      const currentDataIndex = judgeData.findIndex((item: HandleTableDataItem) => item.uid === currentControlData.uid);

      if (!currentDataIndex) {
        return false
      }
    }

    // 如果是子级里面的数据
    const parentData = flattenData.find((item) => item.uid === parentUId);

    const childrenListArray = parentData?.children;

    const indexInChildListArray = childrenListArray?.findIndex((item) => item.uid === currentControlData.uid);

    if (!indexInChildListArray) {
      return false
    }

    return true

  }, [JSON.stringify(currentControlData), JSON.stringify(finallyDataSource)])

  // 下移功能的权限判断
  const downJurisdiction = useMemo(() => {
    if (!currentControlData.uid) {
      return false
    }

    // 先判断当前数据有没有parentId, 有就代表第一级，用finalyDataSource判断是不是有上一个兄弟节点
    const parentUId = currentControlData.parentId;
    if (!parentUId) {
      const judgeData = JSON.parse(JSON.stringify(finallyDataSource));
      const currentDataIndex = judgeData.findIndex((item: HandleTableDataItem) => item.uid === currentControlData.uid);

      if (currentDataIndex === judgeData.length) {
        return false
      }
    }

    // 如果是子级里面的数据
    const parentData = flattenData.find((item) => item.uid === parentUId);

    const childrenListArray = parentData?.children;

    const indexInChildListArray = childrenListArray?.findIndex((item) => item.uid === currentControlData.uid);

    if (!childrenListArray || !childrenListArray.length) {
      return false
    }

    if (indexInChildListArray === childrenListArray.length - 1) {
      return false
    }

    return true

  }, [JSON.stringify(currentControlData), JSON.stringify(finallyDataSource)])

  // 升级功能的权限判断
  const upGradeJurisdiction = useMemo(() => {
    if (!currentControlData.uid) {
      return false
    }

    const parentUId = currentControlData.parentId;

    if (!parentUId) {
      return false
    }

    return true
  }, [JSON.stringify(currentControlData), JSON.stringify(finallyDataSource)])

  // 降级功能的权限判断
  const downGradeJurisdiction = useMemo(() => {
    // 判断是否可以降级，就是判断当前操纵数据是不是有兄弟元素
    const parentUId = currentControlData.parentId;

    if(!parentUId && finallyDataSource) {
      const sourceData = JSON.parse(JSON.stringify(finallyDataSource));
      if(sourceData && sourceData.length === 1) {
        return false
      }
    }
  
    // 代表有父级的降级
    const childrenListArray = flattenData.find((item: HandleTableDataItem) => item.uid === parentUId)?.children ?? [];
    if (childrenListArray && childrenListArray.length === 1) {
      // 只有一个节点，不允许降级
      return false
    }

    return true

  }, [JSON.stringify(currentControlData), JSON.stringify(finallyDataSource)])

  // 鼠标左键点击进入激活状态，并且绑定外面传入的事件
  const trLeftClickEvent = (record: HandleTableDataItem) => {

    const finalyData = flattenData.find((item) => item.uid === record.uid);
    if (finalyData) {
      setCurrentControlData(finalyData);
      leftClickEvent?.(finalyData);
    }
  }
  // 点击事件
  const rowClickEvent = (record: HandleTableDataItem) => {
    return {
      onClick: () => {
        trLeftClickEvent(record)
      }
    }
  }

  // 上移功能
  const upEvent = () => {
    if (!upJurisdiction) {
      message.error("您没有权限进行该操作");
      return
    }

    const parentUId = currentControlData.parentId;
    const uId = currentControlData.uid;
    // 没有parentId 就代表是第一级的任务，操作源数据就行。
    if (!parentUId) {
      const controlData = JSON.parse(JSON.stringify(finallyDataSource));
      const currentIndex = controlData.findIndex((item) => item.uid === uId);
      const nextDataIndex = currentIndex - 1;

      if (!currentIndex) {
        message.error("已经是第一个了，不能再上移了");
        return
      }

      controlData.splice(currentIndex, 1, ...controlData.splice(nextDataIndex, 1, controlData[currentIndex]));
      setFinallyDataSource(controlData)

    } else {
      // 用parentUId 去寻找父亲下的children，然后寻找同级元素
      const parentData = flattenData.find((item) => item.uid === parentUId);

      if (!parentData) {
        return
      }

      const childrenData = parentData.children;

      if (!childrenData) {
        return
      }

      const currentDataIndex = childrenData.findIndex((item) => item.uid === uId);

      if (!currentDataIndex) {
        message.error("已经是第一个了，不能再上移了");
        return
      }

      const nextData = childrenData[currentDataIndex - 1].uid;

      const currentIndex = flattenData.findIndex((item) => item.uid === uId);
      const nextIndex = flattenData.findIndex((item) => item.uid === nextData);

      flattenData.splice(currentIndex, 1, ...flattenData.splice(nextIndex, 1, flattenData[currentIndex]))

      setFinallyDataSource(toTreeData(flattenData))

    }
    setMenuShowFlag(false);
  }

  // 下移功能
  const downEvent = () => {
    if (!downJurisdiction) {
      message.error("您没有该操作的操作权限");
      return
    }
    const parentUId = currentControlData.parentId;
    const uId = currentControlData.uid;
    // 没有parentId 就代表是第一级的任务，操作源数据就行。
    if (!parentUId) {
      const controlData = JSON.parse(JSON.stringify(finallyDataSource));
      const currentIndex = controlData.findIndex((item: HandleTableDataItem) => item.uid === uId);
      const nextDataIndex = currentIndex + 1;

      const dataLength = controlData.length;

      if (currentIndex + 2 > dataLength) {
        message.error("已经是最后一个了，不能再下移了");
        return
      }

      controlData.splice(currentIndex, 1, ...controlData.splice(nextDataIndex, 1, controlData[currentIndex]));
      setFinallyDataSource(controlData)

    } else {
      // 用parentUId 去寻找父亲下的children，然后寻找同级元素
      const parentData = flattenData.find((item) => item.uid === parentUId);

      if (!parentData) {
        return
      }

      const childrenData = parentData.children;

      if (!childrenData) {
        return
      }

      const currentDataIndex = childrenData.findIndex((item) => item.uid === uId);

      const dataLength = childrenData.length;

      if (currentDataIndex + 2 > dataLength) {
        message.error("已经是最后一个了，不能再下移了");
        return
      }

      const nextData = childrenData[currentDataIndex + 1].uid;

      const currentIndex = flattenData.findIndex((item) => item.uid === uId);
      const nextIndex = flattenData.findIndex((item) => item.uid === nextData);

      flattenData.splice(currentIndex, 1, ...flattenData.splice(nextIndex, 1, flattenData[currentIndex]))

      setFinallyDataSource(toTreeData(flattenData))

    }
    setMenuShowFlag(false);
  }

  // 升级功能
  const upGradeEvent = () => {
    if (!upGradeJurisdiction) {
      message.error("您没有该操作的操作权限");
      return
    }

    const currentDataIndex = flattenData.findIndex((item) => item.uid === currentControlData.uid);
    const parentUId = currentControlData.parentId;

    if (!parentUId) {
      message.error("已经是最顶级了，不能再升了!")
      return
    }

    const parentData = flattenData.find((item) => item.uid === parentUId);

    if (!parentData) {
      return
    }

    const grandParentUId = parentData.parentId;

    const emptyObj = Object.assign({}, { ...currentControlData, parentId: grandParentUId });

    flattenData.splice(currentDataIndex, 1, emptyObj);

    setFinallyDataSource(toTreeData(flattenData));
    setMenuShowFlag(false);
    setCurrentControlData(emptyObj);
  }

  // 降级功能
  const downGradeEvent = () => {
    if (!downGradeJurisdiction) {
      message.error("您没有当前操作的操作权限");
      return
    }

    const currentDataIndex = flattenData.findIndex((item) => item.uid === currentControlData.uid);
    const parentUId = currentControlData.parentId;
    // 代表是最顶级的数据的降级
    if (!parentUId) {
      const sourceData = JSON.parse(JSON.stringify(finallyDataSource));
      const currentIndexInSourceData = sourceData.findIndex((item: HandleTableDataItem) => item.uid === currentControlData.uid);
      if (sourceData && sourceData.length === 1) {
        // 代表就只有一个数组，不能降级
        message.error("没有兄弟节点，不允许降级!")
        return
      }
      let brotherUId = null;
      let brotherIndex = null;
      // 代表有兄弟节点，有上一个就找上一个，没有上一个就找下一个
      if (currentIndexInSourceData - 1 > -1) {
        // 代表有上一个兄弟元素
        brotherUId = sourceData[currentIndexInSourceData - 1].uid;
        brotherIndex = currentIndexInSourceData - 1;
      } else {
        brotherUId = sourceData[currentIndexInSourceData + 1].uid;
        brotherIndex = currentIndexInSourceData + 1;
      }

      const emptyObj = Object.assign({}, { ...currentControlData, parentId: brotherUId });
      if (!sourceData[brotherIndex].children) {
        sourceData[brotherIndex].children = [];
        sourceData[brotherIndex].children.push(emptyObj);
      } else {
        sourceData[brotherIndex].children.push(emptyObj);
      }

      sourceData.splice(currentIndexInSourceData, 1);

      setFinallyDataSource(sourceData);
      setMenuShowFlag(false);
      setCurrentControlData(emptyObj);

      return
    }

    // 代表有父级的降级
    const childrenListArray = flattenData.find((item: HandleTableDataItem) => item.uid === parentUId)?.children ?? [];
    if (childrenListArray && childrenListArray.length === 1) {
      // 只有一个节点，不允许降级
      message.error("所在节点中只有一个节点，不允许降级")
      return
    }

    // 寻找兄弟节点，没有上一个节点，就去找下一个节点
    const currentDataInChildArrayIndex = childrenListArray.findIndex((item) => item.uid === currentControlData.uid);

    let brotherUId = null;

    // 代表有兄弟节点，有上一个就找上一个，没有上一个就找下一个
    if (currentDataInChildArrayIndex - 1 > -1) {
      // 代表有上一个兄弟元素
      brotherUId = childrenListArray[currentDataInChildArrayIndex - 1].uid;
    } else {
      brotherUId = childrenListArray[currentDataInChildArrayIndex + 1].uid;
    }

    const emptyObj = Object.assign({}, { ...currentControlData, parentId: brotherUId });

    flattenData.splice(currentDataIndex, 1, emptyObj);

    setFinallyDataSource(toTreeData(flattenData));
    setMenuShowFlag(false);
    setCurrentControlData(emptyObj);
  }

  // 新增同级功能
  const addPeerNodeEvent = () => {
    if (!currentControlData.uid) {
      message.error("必须选择一个操纵目标");
      return
    }
    setPeerModalVisible(true);
    setMenuShowFlag(false);
  }

  // 新增子级功能
  const addChildNodeEvent = () => {
    if (!currentControlData.uid) {
      message.error("必须选择一个操纵目标");
      return
    }
    setChildModalVisible(true);
    setMenuShowFlag(false);
  }

  // 编辑节点数据功能
  const editNodeEvent = () => {
    if (!currentControlData.uid) {
      message.error("必须选择一个操纵目标");
      return
    }
    editNodeForm.setFieldsValue(currentControlData);
    setEditModalVisible(true);
    setMenuShowFlag(false);
  }

  // 删除功能
  const deleteNodeEvent = () => {
    if (!currentControlData.uid) {
      message.error("必须选择一个操纵目标");
      return
    }

    const currentDataIndex = flattenData.findIndex((item) => item.uid === currentControlData.uid);
    flattenData.splice(currentDataIndex, 1);

    setFinallyDataSource(toTreeData(flattenData));
    setPeerModalVisible(false);
    setMenuShowFlag(false);
    setCurrentControlData({ uid: "", parentId: "" });
  }

  // 确认新增同级
  const sureAddPeerNodeEvent = () => {
    addPeerForm.validateFields().then(values => {
      const emptyObj = {};
      Object.keys(currentControlData).forEach((key) => {
        if (key === "uid") {
          emptyObj["uid"] = new Date().getTime();

        } else if (key === "parentId") {
          emptyObj["parentId"] = currentControlData["parentId"];
        } else {
          emptyObj[key] = values[key]
        }
      })

      const currentIndex = flattenData.findIndex((item) => item.uid === currentControlData.uid);

      flattenData.splice(currentIndex + 1, 0, emptyObj as HandleTableDataItem);

      setFinallyDataSource(toTreeData(flattenData));
      setPeerModalVisible(false);
      addPeerForm.resetFields();
    })
  }

  // 确认新增子级节点
  const sureAddChildNodeEvent = () => {
    addChildForm.validateFields().then(values => {
      const emptyObj = {};
      Object.keys(currentControlData).forEach((key) => {
        if (key === "uid") {
          emptyObj["uid"] = new Date().getTime();

        } else if (key === "parentId") {
          emptyObj["parentId"] = currentControlData["uid"];
        } else {
          emptyObj[key] = values[key]
        }
      })

      flattenData.push(emptyObj as HandleTableDataItem);

      setFinallyDataSource(toTreeData(flattenData));
      setChildModalVisible(false);
      addChildForm.resetFields();
    })
  }
  // 确认编辑
  const sureEditNodeEvent = () => {
    editNodeForm.validateFields().then(values => {
      const emptyObj = Object.assign(currentControlData, values);

      const currentDataIndex = flattenData.findIndex((item) => item.uid === currentControlData.uid);
      flattenData.splice(currentDataIndex, 1, emptyObj);

      setFinallyDataSource(toTreeData(flattenData));
      setEditModalVisible(false);
      setCurrentControlData(emptyObj);
      editNodeForm.resetFields();

    })
  }

  // 右键菜单
  const TableRightMenu = () => {
    const ref = useRef(null);

    useOnClickOutside(ref, () => {
      setMenuShowFlag(false);
    })

    return (
      <div ref={ref} className={styles.tableMenu} style={{ left: `${menuShowLeft}px`, top: `${menuShowTop}px` }}>
        <Menu>
          <Menu.Item onClick={() => addPeerNodeEvent()}>
            新增同级节点
          </Menu.Item>
          <Menu.Item onClick={() => addChildNodeEvent()}>
            新增子级节点
          </Menu.Item>
          <Menu.Item onClick={() => editNodeEvent()}>
            编辑
          </Menu.Item>
          <Menu.Item onClick={() => deleteNodeEvent()}>
            删除
          </Menu.Item>
          {
            upJurisdiction ?
              <Menu.Item onClick={() => upEvent()}>
                上移
              </Menu.Item> : null
          }
          {
            downJurisdiction ?
              <Menu.Item onClick={() => downEvent()}>
                下移
              </Menu.Item> : null
          }
          {
            upGradeJurisdiction ?
              <Menu.Item onClick={() => upGradeEvent()}>
                升级
            </Menu.Item> : null
          }
          {
            downGradeJurisdiction ?
              <Menu.Item onClick={() => downGradeEvent()}>
                降级
            </Menu.Item> : null
          }
        </Menu>
      </div>
    )
  }

  // 右键添加上激活的事件 左键也可使用
  const currentTrClickEvent = (uId: string) => {

    const data = flattenData.find((item) => item.uid === uId);
    setCurrentControlData(data as HandleTableDataItem)
  }

  const TableTrComponent = ({ className, ...rest }) => {
    // 目前给tr的鼠标右键绑定上弹出menu的事件
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

    if (currentControlData.uid && currentControlData.uid === uid) {
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
  }, [dataSource])

  return (
    <div className={styles.wrapTable}>
      <div className={styles.iconContent}>
        <SmallIcon className={styles.tableIcon} onClick={() => addPeerNodeEvent()} title="新增同级节点" icon="add-peer" />
        <SmallIcon className={styles.tableIcon} onClick={() => addChildNodeEvent()} title="新增子级节点" icon="add-child" />
        <SmallIcon className={styles.tableIcon} onClick={() => editNodeEvent()} title="编辑" icon="edit" />
        <SmallIcon className={styles.tableIcon} onClick={() => deleteNodeEvent()} title="删除" icon="delete" />
        <SmallIcon disabled={!upJurisdiction} className={styles.tableIcon} onClick={() => upEvent()} title="上移" icon="up" />
        <SmallIcon disabled={!downJurisdiction} className={styles.tableIcon} onClick={() => downEvent()} title="下移" icon="down" />
        <SmallIcon disabled={!upGradeJurisdiction} className={styles.tableIcon} onClick={() => upGradeEvent()} title="升级" icon="up-grade" />
        <SmallIcon disabled={!downGradeJurisdiction} className={styles.tableIcon} onClick={() => downGradeEvent()} title="降级" icon="down-grade" />
      </div>
      <WrapperComponent
        dataSource={finallyDataSource}
        components={components}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) => {
            const { children } = record;
            if (!children || children.length === 0) {
              return <span style={{ marginRight: "6px" }}></span>
            }
            return expanded ? (
              <MinusSquareOutlined style={{ marginRight: "6px" }} onClick={e => onExpand(record, e)} />
            ) : (
                <PlusSquareOutlined style={{ marginRight: "6px" }} onClick={e => onExpand(record, e)} />
              )
          }
        }}
        onRow={rowClickEvent}
        rowSelection={{ ...rowSelection, checkStrictly }}
        {...restProps as P} />
      {menuShowFlag ? <TableRightMenu /> : null}
      <Modal title="新增同级节点" visible={peerModalVisible} width="900px" onCancel={() => setPeerModalVisible(false)} onOk={sureAddPeerNodeEvent}>
        <Form form={addPeerForm}>
          {peerForm?.()}
        </Form>
      </Modal>
      <Modal title="新增子级节点" visible={childModalVisible} width="900px" onCancel={() => setChildModalVisible(false)} onOk={sureAddChildNodeEvent}>
        <Form form={addChildForm}>
          {childForm?.()}
        </Form>
      </Modal>
      <Modal title="编辑节点数据" visible={editModalVisible} width="900px" onCancel={() => setEditModalVisible(false)} onOk={sureEditNodeEvent}>
        <Form form={editNodeForm}>
          {editForm?.()}
        </Form>
      </Modal>
    </div>
  )
}

export default wrapperTable(Table)



