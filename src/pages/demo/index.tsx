import React, {useState} from "react";
import styles from "./index.less"
import TotalTable, {TreeData} from "@/pages/demo/components/total-table";
import ChildrenTable from "@/pages/demo/components/children-table";
import {DataManagementContext} from "@/pages/demo/context";
import TableForm from "@/pages/demo/components/table-form";
import IconComponent from "@/components/icon-component";


const testData = {
  1: [{
    name: "主要生产建筑",
    age: "11",
    uid: 2,
    price: "1,000.00",
    unit: "平方",
    children: [
      {
        name: "1.1主控通讯楼", age: "111", uid: 3, price: "1,000.00", unit: "平方", children: [
          {name: "1.1.1一般土建", age: "112", uid: 4, price: "10,000.00", unit: "个", remark: "111"},
          {name: "1.1.2给排水", age: "113", uid: 5, price: "10.00", unit: "米", remark: "222"},
          {name: "1.1.3渠道、通风及空调", age: "114", uid: 6, price: "200.00", unit: "个", remark: "333"},
          {name: "1.1.4隔断", age: "114", uid: 7, price: "300.00", unit: "平方", remark: "444"},
        ]
      },
    ]
  },],
  2: [{
    name: "1.1主控通讯楼", age: "111", uid: 3, price: "1,000.00", unit: "平方", children: [
      {name: "1.1.1一般土建", age: "112", uid: 4, price: "10,000.00", unit: "个", remark: "111"},
      {name: "1.1.2给排水", age: "113", uid: 5, price: "10.00", unit: "米", remark: "222"},
      {name: "1.1.3渠道、通风及空调", age: "114", uid: 6, price: "200.00", unit: "个", remark: "333"},
      {name: "1.1.4隔断", age: "114", uid: 7, price: "300.00", unit: "平方", remark: "444"},
    ]
  }],
  3: [
    {name: "1.1.1一般土建", age: "112", uid: 4, price: "10,000.00", unit: "个", remark: "111"},
    {name: "1.1.2给排水", age: "113", uid: 5, price: "10.00", unit: "米", remark: "222"},
    {name: "1.1.3渠道、通风及空调", age: "114", uid: 6, price: "200.00", unit: "个", remark: "333"},
    {name: "1.1.4隔断", age: "114", uid: 7, price: "300.00", unit: "平方", remark: "444"},
  ]
}

const testFormData = {
  2: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
  ],
  3: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
    {
      title: "单价",
      type: "input",
      required: true,
      rule: "",
      index: "price"
    },
  ],
  4: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
    {
      title: "单价",
      type: "input",
      required: true,
      rule: "",
      index: "price"
    },
  ],
  5: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
    {
      title: "单价",
      type: "input",
      required: true,
      rule: "",
      index: "price"
    },
  ],
  6: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
    {
      title: "单价",
      type: "input",
      required: true,
      rule: "",
      index: "price"
    },
  ],
  7: [
    {
      title: "名称",
      type: "input",
      required: true,
      rule: "",
      index: "name"
    },
    {
      title: "编码",
      type: "input",
      required: true,
      rule: "",
      index: "age"
    },
    {
      title: "单位",
      type: "input",
      required: true,
      rule: "",
      index: "unit"
    },
    {
      title: "单价",
      type: "input",
      required: true,
      rule: "",
      index: "price"
    },
  ]
}

const DemoPage: React.FC = () => {
  const [currentMainTableChooseData, setCurrentMainTableChooseData] = useState<object>({});
  const [currentChildTableData, setCurrentChildTableData] = useState<object>({});
  const [currentChildTableChooseData, setCurrentChildTableChooseData] = useState<object>({});
  const [currentControlDataFormData, setCurrentControlDataFormData] = useState<object>({})

  const mainTableChooseEvent = (data: TreeData) => {
    setCurrentMainTableChooseData(data);
    const chooseDataId = data.uid;
    const testChildrenTableData = testData[chooseDataId];
    const testChildrenTableColumns = [
      {title: "名称", key: "name", dataIndex: "name"},
      {title: "编码", key: "age", dataIndex: "age"},
      {title: "单位", key: "unit", dataIndex: "unit"},
      {title: "单价", key: "price", dataIndex: "price"},
    ]

    setCurrentChildTableData({
      columns: testChildrenTableColumns,
      data: testChildrenTableData
    })
  };

  const childTableChooseEvent = (data: any) => {
    setCurrentChildTableChooseData(data)
    const chooseChildData = data.uid;
    const formData = testFormData[chooseChildData];
    setCurrentControlDataFormData({formData})
  }

  return (
    <DataManagementContext.Provider value={{
      currentMainTableChooseData,
      mainTableChooseEvent,
      currentChildTableData,
      childTableChooseEvent,
      currentChildTableChooseData,
      currentControlDataFormData
    }}>
      <div className={`${styles.flex} ${styles.buttonContent}`}>
        <IconComponent icon="Add" name="新增" />
        <IconComponent icon="Delete" name="删除" />
        <IconComponent icon="Arrow_Up" name="上移"/>
        <IconComponent icon="Arrow_Down" name="下移"/>
        <IconComponent icon="Share" name="导出"/>
      </div>
      <div className={`${styles.flex} ${styles.main}`}>
        <div className={styles.contentLeft}>
          <TotalTable/>
        </div>
        <div className={styles.contentRight}>
          <div className={styles.contentRightTop}>
            <ChildrenTable/>
          </div>
          <div className={styles.contentRightBottom}>
            <TableForm/>
          </div>
        </div>
      </div>
    </DataManagementContext.Provider>
  )
}

export default DemoPage
